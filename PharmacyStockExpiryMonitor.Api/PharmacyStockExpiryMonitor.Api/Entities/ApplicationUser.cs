using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace PharmacyStockExpiryMonitor.Api.Entities;

public class ApplicationUser : IdentityUser<int>
{
    [Required]
    [StringLength(150)]
    public string FullName { get; set; } = string.Empty;

    public bool IsActive { get; set; } = true;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public bool IsDeleted { get; set; } = false;

    public int? RoleId { get; set; }

    public ICollection<AuditLog> AuditLogs { get; set; }
        = new List<AuditLog>();
}