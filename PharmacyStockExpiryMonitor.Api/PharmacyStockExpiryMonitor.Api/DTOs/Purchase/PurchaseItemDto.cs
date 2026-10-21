using System.ComponentModel.DataAnnotations;

namespace PharmacyStockExpiryMonitor.Api.DTOs.Purchase
{
    public class PurchaseItemDto
    {
        [Range(1, int.MaxValue)]
        public int MedicineId { get; set; }

        public string? MedicineName { get; set; }

        public string? MedicineCode { get; set; }

        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }

        [Range(0, double.MaxValue)]
        public decimal UnitPrice { get; set; }
    }
}