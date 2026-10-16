using System.ComponentModel.DataAnnotations;

namespace PharmacyStockExpiryMonitor.Api.DTOs.User
{
    public class AssignRoleDto
    {
        [Required]
        public int RoleId { get; set; } 
    }
}