using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PharmacyStockExpiryMonitor.Api.Data;
using PharmacyStockExpiryMonitor.Api.DTOs.Auth;
using PharmacyStockExpiryMonitor.Api.Entities;
using PharmacyStockExpiryMonitor.Api.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PharmacyStockExpiryMonitor.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IAuditLogService _auditLogService;
        private readonly ApplicationDbContext _context;

        public AuthService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<int>> roleManager,
            IConfiguration configuration,
            IAuditLogService auditLogService,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _auditLogService = auditLogService;
            _context = context;
        }

        public async Task<LoginResponseDto?> LoginAsync(
            LoginRequestDto request)
        {
            var user = await _userManager
                .FindByEmailAsync(request.Email);

            if (user == null)
                return null;

            if (!user.IsActive || user.IsDeleted)
                return null;

            var passwordValid =
                await _userManager.CheckPasswordAsync(
                    user,
                    request.Password);

            if (!passwordValid)
                return null;

            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            int roleId = user.RoleId ?? 1;
            if (user.RoleId == null)
            {
                var rolesList = await _userManager.GetRolesAsync(user);
                var primaryRole = rolesList.FirstOrDefault();
                if (primaryRole != null)
                {
                    var roleEntity = await _roleManager.FindByNameAsync(primaryRole);
                    if (roleEntity != null)
                    {
                        roleId = roleEntity.Id;
                    }
                }
            }

            var token = await GenerateTokenAsync(user, roleId);

            await _auditLogService.LogAsync(
                "LOGIN",
                "User",
                user.Id.ToString(),
                null,
                $"User {user.Email} successfully logged in.");

            return new LoginResponseDto
            {
                Token = token,
                UserId = user.Id,
                Email = user.Email!,
                FullName = user.FullName,
                RoleId = roleId
            };
        }

        private async Task<string> GenerateTokenAsync(
            ApplicationUser user,
            int roleId)
        {
            var jwtSettings =
                _configuration.GetSection("JwtSettings");

            var key = jwtSettings["Key"]!;
            var issuer = jwtSettings["Issuer"]!;
            var audience = jwtSettings["Audience"]!;

            var expiryHours = int.Parse(
                _configuration["JwtSettings:ExpiryHours"]!
            );

            // Get roles assigned to the user
            var roles = await _userManager.GetRolesAsync(user);

            var claims = new List<Claim>
            {
                new Claim(
                    ClaimTypes.NameIdentifier,
                    user.Id.ToString()),

                new Claim(
                    ClaimTypes.Email,
                    user.Email ?? string.Empty),

                new Claim(
                    ClaimTypes.Name,
                    user.FullName ?? string.Empty),

                new Claim(
                    "roleId",
                    roleId.ToString())
            };

            // Add user roles to JWT
            foreach (var role in roles)
            {
                claims.Add(
                    new Claim(
                        ClaimTypes.Role,
                        role));
            }

            var securityKey =
                new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(key));

            var credentials =
                new SigningCredentials(
                    securityKey,
                    SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: issuer,
                audience: audience,
                claims: claims,
                expires: DateTime.UtcNow.AddHours(expiryHours),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler()
                .WriteToken(token);
        }
    }
}