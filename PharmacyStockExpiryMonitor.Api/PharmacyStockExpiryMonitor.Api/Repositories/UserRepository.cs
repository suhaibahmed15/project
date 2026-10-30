using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using PharmacyStockExpiryMonitor.Api.Data;
using PharmacyStockExpiryMonitor.Api.Entities;
using PharmacyStockExpiryMonitor.Api.Repositories.Interfaces;

namespace PharmacyStockExpiryMonitor.Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public UserRepository(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async Task<List<ApplicationUser>> GetAllAsync()
    {
        return await _context.Users
            .Where(x => !x.IsDeleted)
            .OrderBy(x => x.FullName)
            .ToListAsync();
    }

    public async Task<ApplicationUser?> GetByIdAsync(int id)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
    }

    public async Task<ApplicationUser?> GetByEmailAsync(string email)
    {
        var normalizedEmail = email.ToUpper();
        return await _context.Users
            .FirstOrDefaultAsync(x => (x.NormalizedEmail == normalizedEmail || x.Email == email) && !x.IsDeleted);
    }

    public async Task<bool> EmailExistsAsync(string email)
    {
        var normalizedEmail = email.ToUpper();
        return await _context.Users
            .AnyAsync(x => (x.NormalizedEmail == normalizedEmail || x.Email == email) && !x.IsDeleted);
    }

    public async Task<IdentityResult> CreateAsync(ApplicationUser user, string password)
    {
        return await _userManager.CreateAsync(user, password);
    }

    public async Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string roleName)
    {
        return await _userManager.AddToRoleAsync(user, roleName);
    }

    public async Task<IdentityResult> RemoveFromRolesAsync(ApplicationUser user, IEnumerable<string> roles)
    {
        return await _userManager.RemoveFromRolesAsync(user, roles);
    }

    public async Task<IList<string>> GetRolesAsync(ApplicationUser user)
    {
        return await _userManager.GetRolesAsync(user);
    }

    public async Task<IdentityResult> DeleteIdentityUserAsync(ApplicationUser user)
    {
        return await _userManager.DeleteAsync(user);
    }

    public async Task UpdateAsync(ApplicationUser user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(ApplicationUser user)
    {
        user.IsDeleted = true;
        user.IsActive = false;
        user.UpdatedAt = DateTime.UtcNow;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }
}

