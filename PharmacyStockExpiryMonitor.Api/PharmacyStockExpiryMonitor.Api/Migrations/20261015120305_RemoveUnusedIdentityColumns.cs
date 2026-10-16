using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmacyStockExpiryMonitor.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveUnusedIdentityColumns : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF COL_LENGTH('AspNetUsers', 'AccessFailedCount') IS NOT NULL
                    ALTER TABLE AspNetUsers DROP COLUMN AccessFailedCount;
                IF COL_LENGTH('AspNetUsers', 'EmailConfirmed') IS NOT NULL
                    ALTER TABLE AspNetUsers DROP COLUMN EmailConfirmed;
                IF COL_LENGTH('AspNetUsers', 'LockoutEnabled') IS NOT NULL
                    ALTER TABLE AspNetUsers DROP COLUMN LockoutEnabled;
                IF COL_LENGTH('AspNetUsers', 'LockoutEnd') IS NOT NULL
                    ALTER TABLE AspNetUsers DROP COLUMN LockoutEnd;
                IF COL_LENGTH('AspNetUsers', 'PhoneNumberConfirmed') IS NOT NULL
                    ALTER TABLE AspNetUsers DROP COLUMN PhoneNumberConfirmed;
                IF COL_LENGTH('AspNetUsers', 'TwoFactorEnabled') IS NOT NULL
                    ALTER TABLE AspNetUsers DROP COLUMN TwoFactorEnabled;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
        }
    }
}
