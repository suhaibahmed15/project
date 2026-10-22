using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmacyStockExpiryMonitor.Api.Migrations
{
    /// <inheritdoc />
    public partial class ConvertBooleansToIntAndNormalizeUserIds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "IsDeleted",
                table: "Suppliers",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsActive",
                table: "Suppliers",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsAdminOverride",
                table: "StockTransactions",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsDeleted",
                table: "Purchases",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsDeleted",
                table: "Medicines",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsActive",
                table: "Medicines",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsDeleted",
                table: "Categories",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsActive",
                table: "Categories",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsDeleted",
                table: "Batches",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsDeleted",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsActive",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsResolved",
                table: "Alerts",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.AlterColumn<int>(
                name: "IsRead",
                table: "Alerts",
                type: "int",
                nullable: false,
                oldClrType: typeof(bool),
                oldType: "bit");

            migrationBuilder.Sql(@"
                -- Normalize CreatedBy and UpdatedBy across all tables to User IDs
                UPDATE [Medicines] SET [CreatedBy] = '1' WHERE [CreatedBy] = 'Admin' OR [CreatedBy] = '' OR [CreatedBy] IS NULL;
                UPDATE [Medicines] SET [CreatedBy] = '2' WHERE [CreatedBy] = 'StoreManager';
                UPDATE [Medicines] SET [CreatedBy] = '3' WHERE [CreatedBy] = 'Pharmacist';
                UPDATE [Medicines] SET [UpdatedBy] = '1' WHERE [UpdatedBy] = 'Admin';
                UPDATE [Medicines] SET [UpdatedBy] = '2' WHERE [UpdatedBy] = 'StoreManager';
                UPDATE [Medicines] SET [UpdatedBy] = '3' WHERE [UpdatedBy] = 'Pharmacist';

                UPDATE [Batches] SET [CreatedBy] = '1' WHERE [CreatedBy] = 'Admin' OR [CreatedBy] = '' OR [CreatedBy] IS NULL;
                UPDATE [Batches] SET [CreatedBy] = '2' WHERE [CreatedBy] = 'StoreManager';
                UPDATE [Batches] SET [CreatedBy] = '3' WHERE [CreatedBy] = 'Pharmacist';
                UPDATE [Batches] SET [UpdatedBy] = '1' WHERE [UpdatedBy] = 'Admin';
                UPDATE [Batches] SET [UpdatedBy] = '2' WHERE [UpdatedBy] = 'StoreManager';
                UPDATE [Batches] SET [UpdatedBy] = '3' WHERE [UpdatedBy] = 'Pharmacist';

                UPDATE [Categories] SET [CreatedBy] = '1' WHERE [CreatedBy] = 'Admin' OR [CreatedBy] = '' OR [CreatedBy] IS NULL;
                UPDATE [Categories] SET [CreatedBy] = '2' WHERE [CreatedBy] = 'StoreManager';
                UPDATE [Categories] SET [CreatedBy] = '3' WHERE [CreatedBy] = 'Pharmacist';
                UPDATE [Categories] SET [UpdatedBy] = '1' WHERE [UpdatedBy] = 'Admin';
                UPDATE [Categories] SET [UpdatedBy] = '2' WHERE [UpdatedBy] = 'StoreManager';
                UPDATE [Categories] SET [UpdatedBy] = '3' WHERE [UpdatedBy] = 'Pharmacist';

                UPDATE [Suppliers] SET [CreatedBy] = '1' WHERE [CreatedBy] = 'Admin' OR [CreatedBy] = '' OR [CreatedBy] IS NULL;
                UPDATE [Suppliers] SET [CreatedBy] = '2' WHERE [CreatedBy] = 'StoreManager';
                UPDATE [Suppliers] SET [CreatedBy] = '3' WHERE [CreatedBy] = 'Pharmacist';
                UPDATE [Suppliers] SET [UpdatedBy] = '1' WHERE [UpdatedBy] = 'Admin';
                UPDATE [Suppliers] SET [UpdatedBy] = '2' WHERE [UpdatedBy] = 'StoreManager';
                UPDATE [Suppliers] SET [UpdatedBy] = '3' WHERE [UpdatedBy] = 'Pharmacist';

                UPDATE [Purchases] SET [CreatedBy] = '1' WHERE [CreatedBy] = 'Admin' OR [CreatedBy] = '' OR [CreatedBy] IS NULL;
                UPDATE [Purchases] SET [CreatedBy] = '2' WHERE [CreatedBy] = 'StoreManager';
                UPDATE [Purchases] SET [CreatedBy] = '3' WHERE [CreatedBy] = 'Pharmacist';
                UPDATE [Purchases] SET [UpdatedBy] = '1' WHERE [UpdatedBy] = 'Admin';
                UPDATE [Purchases] SET [UpdatedBy] = '2' WHERE [UpdatedBy] = 'StoreManager';
                UPDATE [Purchases] SET [UpdatedBy] = '3' WHERE [UpdatedBy] = 'Pharmacist';

                UPDATE [StockTransactions] SET [CreatedBy] = '1' WHERE [CreatedBy] = 'Admin' OR [CreatedBy] = '' OR [CreatedBy] IS NULL;
                UPDATE [StockTransactions] SET [CreatedBy] = '2' WHERE [CreatedBy] = 'StoreManager';
                UPDATE [StockTransactions] SET [CreatedBy] = '3' WHERE [CreatedBy] = 'Pharmacist';
                UPDATE [StockTransactions] SET [UpdatedBy] = '1' WHERE [UpdatedBy] = 'Admin';
                UPDATE [StockTransactions] SET [UpdatedBy] = '2' WHERE [UpdatedBy] = 'StoreManager';
                UPDATE [StockTransactions] SET [UpdatedBy] = '3' WHERE [UpdatedBy] = 'Pharmacist';

                UPDATE [Alerts] SET [CreatedBy] = '1' WHERE [CreatedBy] = 'Admin' OR [CreatedBy] = '' OR [CreatedBy] IS NULL;
                UPDATE [Alerts] SET [CreatedBy] = '2' WHERE [CreatedBy] = 'StoreManager';
                UPDATE [Alerts] SET [CreatedBy] = '3' WHERE [CreatedBy] = 'Pharmacist';
                UPDATE [Alerts] SET [UpdatedBy] = '1' WHERE [UpdatedBy] = 'Admin';
                UPDATE [Alerts] SET [UpdatedBy] = '2' WHERE [UpdatedBy] = 'StoreManager';
                UPDATE [Alerts] SET [UpdatedBy] = '3' WHERE [UpdatedBy] = 'Pharmacist';

                UPDATE [AspNetUsers] SET [CreatedBy] = '1' WHERE [CreatedBy] = 'Admin' OR ([CreatedBy] IS NULL AND [Id] > 1);
                UPDATE [AspNetUsers] SET [UpdatedBy] = '1' WHERE [UpdatedBy] = 'Admin';
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Suppliers",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Suppliers",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsAdminOverride",
                table: "StockTransactions",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Purchases",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Medicines",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Medicines",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Categories",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "Categories",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "Batches",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsDeleted",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsActive",
                table: "AspNetUsers",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsResolved",
                table: "Alerts",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<bool>(
                name: "IsRead",
                table: "Alerts",
                type: "bit",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}
