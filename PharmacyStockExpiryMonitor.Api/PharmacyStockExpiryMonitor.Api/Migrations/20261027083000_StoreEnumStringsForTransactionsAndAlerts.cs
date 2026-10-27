using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmacyStockExpiryMonitor.Api.Migrations
{
    /// <inheritdoc />
    public partial class StoreEnumStringsForTransactionsAndAlerts : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Drop existing indexes on TransactionType and AlertType so columns can be modified
            migrationBuilder.DropIndex(
                name: "IX_StockTransactions_TransactionType",
                table: "StockTransactions");

            migrationBuilder.DropIndex(
                name: "IX_Alerts_AlertType",
                table: "Alerts");

            // 2. Alter column types from int to nvarchar(50)
            migrationBuilder.AlterColumn<string>(
                name: "TransactionType",
                table: "StockTransactions",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "AlertType",
                table: "Alerts",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            // 3. Migrate existing values to descriptive exact string values
            migrationBuilder.Sql(@"
                -- Update StockTransactions to exact strings ('Stock In', 'Stock Out', 'Adjustment', 'Transfer')
                UPDATE [StockTransactions] SET [TransactionType] = 'Stock In' WHERE [TransactionType] IN ('1', 'StockIn');
                UPDATE [StockTransactions] SET [TransactionType] = 'Stock Out' WHERE [TransactionType] IN ('2', 'StockOut');
                UPDATE [StockTransactions] SET [TransactionType] = 'Adjustment' WHERE [TransactionType] IN ('3');
                UPDATE [StockTransactions] SET [TransactionType] = 'Transfer' WHERE [TransactionType] IN ('4');

                -- Update Alerts to exact strings ('Low Stock', 'Near Expiry', 'Expired', 'Stock Out')
                UPDATE [Alerts] SET [AlertType] = 'Low Stock' WHERE [AlertType] IN ('1', 'LowStock');
                UPDATE [Alerts] SET [AlertType] = 'Near Expiry' WHERE [AlertType] IN ('2', 'NearExpiry');
                UPDATE [Alerts] SET [AlertType] = 'Expired' WHERE [AlertType] IN ('3');
                UPDATE [Alerts] SET [AlertType] = 'Stock Out' WHERE [AlertType] IN ('4', 'StockOut');
            ");

            // 4. Re-create indexes
            migrationBuilder.CreateIndex(
                name: "IX_StockTransactions_TransactionType",
                table: "StockTransactions",
                column: "TransactionType");

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_AlertType",
                table: "Alerts",
                column: "AlertType");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_StockTransactions_TransactionType",
                table: "StockTransactions");

            migrationBuilder.DropIndex(
                name: "IX_Alerts_AlertType",
                table: "Alerts");

            migrationBuilder.Sql(@"
                UPDATE [StockTransactions] SET [TransactionType] = '1' WHERE [TransactionType] IN ('Stock In', 'StockIn');
                UPDATE [StockTransactions] SET [TransactionType] = '2' WHERE [TransactionType] IN ('Stock Out', 'StockOut');
                UPDATE [StockTransactions] SET [TransactionType] = '3' WHERE [TransactionType] IN ('Adjustment');
                UPDATE [StockTransactions] SET [TransactionType] = '4' WHERE [TransactionType] IN ('Transfer');

                UPDATE [Alerts] SET [AlertType] = '1' WHERE [AlertType] IN ('Low Stock', 'LowStock');
                UPDATE [Alerts] SET [AlertType] = '2' WHERE [AlertType] IN ('Near Expiry', 'NearExpiry');
                UPDATE [Alerts] SET [AlertType] = '3' WHERE [AlertType] IN ('Expired');
                UPDATE [Alerts] SET [AlertType] = '4' WHERE [AlertType] IN ('Stock Out', 'StockOut');
            ");

            migrationBuilder.AlterColumn<int>(
                name: "TransactionType",
                table: "StockTransactions",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.AlterColumn<int>(
                name: "AlertType",
                table: "Alerts",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(50)",
                oldMaxLength: 50);

            migrationBuilder.CreateIndex(
                name: "IX_StockTransactions_TransactionType",
                table: "StockTransactions",
                column: "TransactionType");

            migrationBuilder.CreateIndex(
                name: "IX_Alerts_AlertType",
                table: "Alerts",
                column: "AlertType");
        }
    }
}
