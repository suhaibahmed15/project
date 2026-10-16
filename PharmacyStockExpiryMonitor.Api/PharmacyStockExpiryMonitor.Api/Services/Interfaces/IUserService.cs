using PharmacyStockExpiryMonitor.Api.DTOs.User;

namespace PharmacyStockExpiryMonitor.Api.Services.Interfaces
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllAsync();

        Task<UserDto?> GetByIdAsync(int id);

        Task<UserDto> CreateAsync(
            CreateUserDto dto);

        Task<bool> AssignRoleAsync(
            int userId,
            AssignRoleDto dto);

        Task<bool> DeleteAsync(int id);
    }
}