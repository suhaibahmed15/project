using System.Text.Json;
using System.Text.Json.Serialization;

namespace PharmacyStockExpiryMonitor.Api.Enums;

public class StockTransactionTypeJsonConverter : JsonConverter<StockTransactionType>
{
    public override StockTransactionType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            var intVal = reader.GetInt32();
            return (StockTransactionType)intVal;
        }

        if (reader.TokenType == JsonTokenType.String)
        {
            var str = reader.GetString();
            if (string.IsNullOrWhiteSpace(str)) return StockTransactionType.StockIn;
            var clean = str.Trim().Replace(" ", "").ToLowerInvariant();
            return clean switch
            {
                "stockin" or "1" => StockTransactionType.StockIn,
                "stockout" or "2" => StockTransactionType.StockOut,
                "adjustment" or "3" => StockTransactionType.Adjustment,
                "transfer" or "4" => StockTransactionType.Transfer,
                _ => Enum.TryParse<StockTransactionType>(str, true, out var result) ? result : StockTransactionType.StockIn
            };
        }

        return StockTransactionType.StockIn;
    }

    public override void Write(Utf8JsonWriter writer, StockTransactionType value, JsonSerializerOptions options)
    {
        var str = value switch
        {
            StockTransactionType.StockIn => "Stock In",
            StockTransactionType.StockOut => "Stock Out",
            StockTransactionType.Adjustment => "Adjustment",
            StockTransactionType.Transfer => "Transfer",
            _ => value.ToString()
        };
        writer.WriteStringValue(str);
    }
}

public class AlertTypeJsonConverter : JsonConverter<AlertType>
{
    public override AlertType Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.Number)
        {
            var intVal = reader.GetInt32();
            return (AlertType)intVal;
        }

        if (reader.TokenType == JsonTokenType.String)
        {
            var str = reader.GetString();
            if (string.IsNullOrWhiteSpace(str)) return AlertType.LowStock;
            var clean = str.Trim().Replace(" ", "").ToLowerInvariant();
            return clean switch
            {
                "lowstock" or "1" => AlertType.LowStock,
                "nearexpiry" or "2" => AlertType.NearExpiry,
                "expired" or "3" => AlertType.Expired,
                "stockout" or "4" => AlertType.StockOut,
                _ => Enum.TryParse<AlertType>(str, true, out var result) ? result : AlertType.LowStock
            };
        }

        return AlertType.LowStock;
    }

    public override void Write(Utf8JsonWriter writer, AlertType value, JsonSerializerOptions options)
    {
        var str = value switch
        {
            AlertType.LowStock => "Low Stock",
            AlertType.NearExpiry => "Near Expiry",
            AlertType.Expired => "Expired",
            AlertType.StockOut => "Stock Out",
            _ => value.ToString()
        };
        writer.WriteStringValue(str);
    }
}
