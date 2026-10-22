using System.ComponentModel.DataAnnotations;

namespace PharmacyStockExpiryMonitor.Api.Entities;

public class AuditLog
{
    public int Id { get; set; }

    public int? UserId { get; set; }
    public ApplicationUser? User { get; set; }

    public int? MedicineId { get; set; }
    public Medicine? Medicine { get; set; }

    public int? BatchId { get; set; }
    public Batch? Batch { get; set; }

    public int? PurchaseId { get; set; }
    public Purchase? Purchase { get; set; }

    public int? SupplierId { get; set; }
    public Supplier? Supplier { get; set; }

    public int? CategoryId { get; set; }
    public Category? Category { get; set; }

    [Required]
    [StringLength(100)]
    public string Action { get; set; } = string.Empty;

    [Required]
    [StringLength(100)]
    public string EntityName { get; set; } = string.Empty;

    [StringLength(100)]
    public string? EntityId { get; set; }

    [StringLength(5000)]
    public string? OldValues { get; set; }

    [StringLength(5000)]
    public string? NewValues { get; set; }

    [StringLength(45)]
    public string? IpAddress { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}