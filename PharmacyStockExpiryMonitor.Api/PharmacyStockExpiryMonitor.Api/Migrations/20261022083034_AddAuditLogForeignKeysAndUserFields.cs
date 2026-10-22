using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmacyStockExpiryMonitor.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAuditLogForeignKeysAndUserFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BatchId",
                table: "AuditLogs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "AuditLogs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MedicineId",
                table: "AuditLogs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PurchaseId",
                table: "AuditLogs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SupplierId",
                table: "AuditLogs",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "AspNetUsers",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastLoginAt",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "AspNetUsers",
                type: "nvarchar(250)",
                maxLength: 250,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_BatchId",
                table: "AuditLogs",
                column: "BatchId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_CategoryId",
                table: "AuditLogs",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_MedicineId",
                table: "AuditLogs",
                column: "MedicineId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_PurchaseId",
                table: "AuditLogs",
                column: "PurchaseId");

            migrationBuilder.CreateIndex(
                name: "IX_AuditLogs_SupplierId",
                table: "AuditLogs",
                column: "SupplierId");

            migrationBuilder.AddForeignKey(
                name: "FK_AuditLogs_Batches_BatchId",
                table: "AuditLogs",
                column: "BatchId",
                principalTable: "Batches",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AuditLogs_Categories_CategoryId",
                table: "AuditLogs",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AuditLogs_Medicines_MedicineId",
                table: "AuditLogs",
                column: "MedicineId",
                principalTable: "Medicines",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AuditLogs_Purchases_PurchaseId",
                table: "AuditLogs",
                column: "PurchaseId",
                principalTable: "Purchases",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_AuditLogs_Suppliers_SupplierId",
                table: "AuditLogs",
                column: "SupplierId",
                principalTable: "Suppliers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AuditLogs_Batches_BatchId",
                table: "AuditLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_AuditLogs_Categories_CategoryId",
                table: "AuditLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_AuditLogs_Medicines_MedicineId",
                table: "AuditLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_AuditLogs_Purchases_PurchaseId",
                table: "AuditLogs");

            migrationBuilder.DropForeignKey(
                name: "FK_AuditLogs_Suppliers_SupplierId",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_BatchId",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_CategoryId",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_MedicineId",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_PurchaseId",
                table: "AuditLogs");

            migrationBuilder.DropIndex(
                name: "IX_AuditLogs_SupplierId",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "BatchId",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "MedicineId",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "PurchaseId",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "SupplierId",
                table: "AuditLogs");

            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LastLoginAt",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "AspNetUsers");
        }
    }
}
