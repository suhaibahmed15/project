namespace PharmacyStockExpiryMonitor.Api.DTOs.User
{
    public class UserDto
    {
        public int Id { get; set; }

        public string FullName { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; }

        public bool IsActive { get; set; }

        public int? RoleId { get; set; }
        public DateTime? LastLoginAt { get; set; }
        public string? CreatedBy { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}