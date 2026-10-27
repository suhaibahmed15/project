using System.Text.Json.Serialization;

namespace PharmacyStockExpiryMonitor.Api.Enums
{
    [JsonConverter(typeof(AlertTypeJsonConverter))]
    public enum AlertType
    {
        LowStock = 1,
        NearExpiry = 2,
        Expired = 3,
        StockOut = 4
    }
}