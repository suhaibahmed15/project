using System.Text.Json.Serialization;

namespace PharmacyStockExpiryMonitor.Api.Enums;

[JsonConverter(typeof(StockTransactionTypeJsonConverter))]
public enum StockTransactionType
{
    StockIn = 1,
    StockOut = 2,
    Adjustment = 3,
    Transfer = 4
}