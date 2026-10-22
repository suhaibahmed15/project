
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PharmacyStockExpiryMonitor.Api.Data;
using PharmacyStockExpiryMonitor.Api.DTOs.User;
using PharmacyStockExpiryMonitor.Api.Entities;
using PharmacyStockExpiryMonitor.Api.Services.Interfaces;
using System.Security.Claims;

namespace PharmacyStockExpiryMonitor.Api.Services
{
    public class UserService : IUserService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;
        private readonly ApplicationDbContext _context;
        private readonly IAuditLogService _auditLogService;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole<int>> roleManager,
            ApplicationDbContext context,
            IAuditLogService auditLogService,
            IHttpContextAccessor httpContextAccessor)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _context = context;
            _auditLogService = auditLogService;
            _httpContextAccessor = httpContextAccessor;
        }

        // Get all users that have not been deleted.
        public async Task<List<UserDto>> GetAllAsync()
        {
            var users = _userManager.Users
                .Where(x => !x.IsDeleted)
                .OrderBy(x => x.FullName)
                .ToList();

            var result = new List<UserDto>();

            foreach (var user in users)
            {
                result.Add(new UserDto
                {
                    Id = user.Id,
                    FullName = user.FullName,
                    Email = user.Email ?? string.Empty,
                    PhoneNumber = user.PhoneNumber,
                    IsActive = user.IsActive,
                    RoleId = user.RoleId,
                    LastLoginAt = user.LastLoginAt,
                    CreatedBy = user.CreatedBy,
                    CreatedAt = user.CreatedAt
                });
            }

            return result;
        }

        // Get a single user by ID.
        public async Task<UserDto?> GetByIdAsync(int id)
        {
            var user = await _userManager.FindByIdAsync(
                id.ToString()
            );

            if (user == null || user.IsDeleted)
            {
                return null;
            }

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                RoleId = user.RoleId,
                LastLoginAt = user.LastLoginAt,
                CreatedBy = user.CreatedBy,
                CreatedAt = user.CreatedAt
            };
        }

        // Create a user and assign the selected role.
        public async Task<UserDto> CreateAsync(
            CreateUserDto dto)
        {
            var email = dto.Email.Trim();

            // Find the role using its integer ID.
            var role = await _roleManager.FindByIdAsync(
                dto.RoleId.ToString()
            );

            if (role == null)
            {
                throw new InvalidOperationException(
                    "The specified role does not exist."
                );
            }

            if (string.IsNullOrWhiteSpace(role.Name))
            {
                throw new InvalidOperationException(
                    "The specified role has no valid name."
                );
            }

            // Check whether the email already exists.
            var existingUser =
                await _userManager.FindByEmailAsync(email);

            if (existingUser != null)
            {
                throw new InvalidOperationException(
                    "A user with this email already exists."
                );
            }

            // Create the user with the selected integer RoleId.
            var user = new ApplicationUser
            {
                UserName = email,
                Email = email,
                FullName = dto.FullName.Trim(),
                PhoneNumber = dto.PhoneNumber?.Trim(),
                RoleId = dto.RoleId,
                IsActive = true,
                IsDeleted = false,
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
                CreatedBy = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System",
                CreatedAt = DateTime.UtcNow
            };

            var createResult = await _userManager.CreateAsync(
                user,
                dto.Password
            );

            if (!createResult.Succeeded)
            {
                var errors = string.Join(
                    ", ",
                    createResult.Errors.Select(
                        x => x.Description
                    )
                );

                throw new InvalidOperationException(errors);
            }

            // Identity assigns membership using the role name.
            var roleResult = await _userManager.AddToRoleAsync(
                user,
                role.Name
            );

            if (!roleResult.Succeeded)
            {
                // Remove the newly created user if assignment fails.
                await _userManager.DeleteAsync(user);

                var errors = string.Join(
                    ", ",
                    roleResult.Errors.Select(
                        x => x.Description
                    )
                );

                throw new InvalidOperationException(errors);
            }

            await _auditLogService.LogJsonAsync(
                "CREATE",
                "User",
                user.Id.ToString(),
                null,
                new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    Role = role.Name
                });

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email ?? string.Empty,
                PhoneNumber = user.PhoneNumber,
                IsActive = user.IsActive,
                RoleId = user.RoleId,
                CreatedAt = user.CreatedAt
            };
        }

        // Change a user's role using an integer RoleId.
        public async Task<bool> AssignRoleAsync(
            int userId,
            AssignRoleDto dto)
        {
            var user = await _userManager.FindByIdAsync(
                userId.ToString()
            );

            if (user == null || user.IsDeleted)
            {
                return false;
            }

            // Find the requested role by its integer ID.
            var role = await _roleManager.FindByIdAsync(
                dto.RoleId.ToString()
            );

            if (role == null)
            {
                throw new InvalidOperationException(
                    "The specified role does not exist."
                );
            }

            if (string.IsNullOrWhiteSpace(role.Name))
            {
                throw new InvalidOperationException(
                    "The specified role has no valid name."
                );
            }

            // Get the user's current Identity roles.
            var existingRoles =
                await _userManager.GetRolesAsync(user);

            // Remove existing role memberships.
            if (existingRoles.Any())
            {
                var removeResult =
                    await _userManager.RemoveFromRolesAsync(
                        user,
                        existingRoles
                    );

                if (!removeResult.Succeeded)
                {
                    var errors = string.Join(
                        ", ",
                        removeResult.Errors.Select(
                            x => x.Description
                        )
                    );

                    throw new InvalidOperationException(errors);
                }
            }

            // Assign the new Identity role.
            var roleResult = await _userManager.AddToRoleAsync(
                user,
                role.Name
            );

            if (!roleResult.Succeeded)
            {
                var errors = string.Join(
                    ", ",
                    roleResult.Errors.Select(
                        x => x.Description
                    )
                );

                throw new InvalidOperationException(errors);
            }

            var oldRoleId = user.RoleId;

            // Keep the custom integer RoleId in sync.
            user.RoleId = dto.RoleId;
            user.UpdatedAt = DateTime.UtcNow;
            user.UpdatedBy = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";

            await _context.SaveChangesAsync();

            await _auditLogService.LogJsonAsync(
                "ASSIGN_ROLE",
                "User",
                user.Id.ToString(),
                new { RoleId = oldRoleId, Roles = existingRoles },
                new { RoleId = dto.RoleId, Role = role.Name });

            return true;
        }

        // Soft-delete a user without physically removing the record.
        public async Task<bool> DeleteAsync(int id)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null || user.IsDeleted)
            {
                return false;
            }

            user.IsDeleted = true;
            user.IsActive = false;
            user.UpdatedAt = DateTime.UtcNow;
            user.UpdatedBy = _httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "System";

            await _context.SaveChangesAsync();

            await _auditLogService.LogJsonAsync(
                "DELETE",
                "User",
                user.Id.ToString(),
                new { user.Id, user.FullName, user.Email, user.IsActive, user.IsDeleted },
                new { user.Id, user.FullName, user.Email, IsActive = false, IsDeleted = true });

            return true;
        }
    }
}
