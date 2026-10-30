using Microsoft.AspNetCore.Identity;
using PharmacyStockExpiryMonitor.Api.Entities;

namespace PharmacyStockExpiryMonitor.Api.Repositories.Interfaces;

public interface IUserRepository
{
    Task<List<ApplicationUser>> GetAllAsync();

    Task<ApplicationUser?> GetByIdAsync(int id);

    Task<ApplicationUser?> GetByEmailAsync(string email);

    Task<bool> EmailExistsAsync(string email);

    Task<IdentityResult> CreateAsync(ApplicationUser user, string password);

    Task<IdentityResult> AddToRoleAsync(ApplicationUser user, string roleName);

    Task<IdentityResult> RemoveFromRolesAsync(ApplicationUser user, IEnumerable<string> roles);

    Task<IList<string>> GetRolesAsync(ApplicationUser user);

    Task<IdentityResult> DeleteIdentityUserAsync(ApplicationUser user);

    Task UpdateAsync(ApplicationUser user);

    Task DeleteAsync(ApplicationUser user);
}

