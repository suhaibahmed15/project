using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PharmacyStockExpiryMonitor.Api.Migrations
{
    /// <inheritdoc />
    public partial class ChangeIdentityKeyToInt : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Drop foreign keys and indexes from AuditLogs pointing to AspNetUsers / UserId
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_AuditLogs_AspNetUsers_UserId')
                    ALTER TABLE [AuditLogs] DROP CONSTRAINT [FK_AuditLogs_AspNetUsers_UserId];
                IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_AuditLogs_AspNetUsers_ApplicationUserId')
                    ALTER TABLE [AuditLogs] DROP CONSTRAINT [FK_AuditLogs_AspNetUsers_ApplicationUserId];

                IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AuditLogs_UserId' AND object_id = OBJECT_ID('AuditLogs'))
                    DROP INDEX [IX_AuditLogs_UserId] ON [AuditLogs];
                IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AuditLogs_ApplicationUserId' AND object_id = OBJECT_ID('AuditLogs'))
                    DROP INDEX [IX_AuditLogs_ApplicationUserId] ON [AuditLogs];

                UPDATE [AuditLogs] SET [UserId] = NULL;
                ALTER TABLE [AuditLogs] ALTER COLUMN [UserId] INT NULL;

                CREATE INDEX [IX_AuditLogs_UserId] ON [AuditLogs] ([UserId]);
            ");

            // Drop existing AspNet child and parent tables
            migrationBuilder.Sql(@"
                DROP TABLE IF EXISTS [AspNetUserTokens];
                DROP TABLE IF EXISTS [AspNetUserRoles];
                DROP TABLE IF EXISTS [AspNetUserLogins];
                DROP TABLE IF EXISTS [AspNetUserClaims];
                DROP TABLE IF EXISTS [AspNetRoleClaims];
                DROP TABLE IF EXISTS [AspNetUsers];
                DROP TABLE IF EXISTS [AspNetRoles];
            ");

            // Recreate AspNetRoles with int IDENTITY(1, 1)
            migrationBuilder.Sql(@"
                CREATE TABLE [AspNetRoles] (
                    [Id] INT IDENTITY(1,1) NOT NULL,
                    [Name] NVARCHAR(256) NULL,
                    [NormalizedName] NVARCHAR(256) NULL,
                    [ConcurrencyStamp] NVARCHAR(MAX) NULL,
                    CONSTRAINT [PK_AspNetRoles] PRIMARY KEY ([Id])
                );
                CREATE UNIQUE INDEX [RoleNameIndex] ON [AspNetRoles] ([NormalizedName]) WHERE [NormalizedName] IS NOT NULL;
            ");

            // Recreate AspNetUsers with int IDENTITY(1, 1)
            migrationBuilder.Sql(@"
                CREATE TABLE [AspNetUsers] (
                    [Id] INT IDENTITY(1,1) NOT NULL,
                    [FullName] NVARCHAR(150) NOT NULL,
                    [IsActive] BIT NOT NULL,
                    [CreatedAt] DATETIME2 NOT NULL,
                    [UpdatedAt] DATETIME2 NULL,
                    [IsDeleted] BIT NOT NULL,
                    [UserName] NVARCHAR(256) NULL,
                    [NormalizedUserName] NVARCHAR(256) NULL,
                    [Email] NVARCHAR(256) NULL,
                    [NormalizedEmail] NVARCHAR(256) NULL,
                    [EmailConfirmed] BIT NOT NULL,
                    [PasswordHash] NVARCHAR(MAX) NULL,
                    [SecurityStamp] NVARCHAR(MAX) NULL,
                    [ConcurrencyStamp] NVARCHAR(MAX) NULL,
                    [PhoneNumber] NVARCHAR(MAX) NULL,
                    [PhoneNumberConfirmed] BIT NOT NULL,
                    [TwoFactorEnabled] BIT NOT NULL,
                    [LockoutEnd] DATETIMEOFFSET NULL,
                    [LockoutEnabled] BIT NOT NULL,
                    [AccessFailedCount] INT NOT NULL,
                    CONSTRAINT [PK_AspNetUsers] PRIMARY KEY ([Id])
                );
                CREATE INDEX [EmailIndex] ON [AspNetUsers] ([NormalizedEmail]);
                CREATE UNIQUE INDEX [UserNameIndex] ON [AspNetUsers] ([NormalizedUserName]) WHERE [NormalizedUserName] IS NOT NULL;
            ");

            // Recreate AspNetRoleClaims
            migrationBuilder.Sql(@"
                CREATE TABLE [AspNetRoleClaims] (
                    [Id] INT IDENTITY(1,1) NOT NULL,
                    [RoleId] INT NOT NULL,
                    [ClaimType] NVARCHAR(MAX) NULL,
                    [ClaimValue] NVARCHAR(MAX) NULL,
                    CONSTRAINT [PK_AspNetRoleClaims] PRIMARY KEY ([Id]),
                    CONSTRAINT [FK_AspNetRoleClaims_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE
                );
                CREATE INDEX [IX_AspNetRoleClaims_RoleId] ON [AspNetRoleClaims] ([RoleId]);
            ");

            // Recreate AspNetUserClaims
            migrationBuilder.Sql(@"
                CREATE TABLE [AspNetUserClaims] (
                    [Id] INT IDENTITY(1,1) NOT NULL,
                    [UserId] INT NOT NULL,
                    [ClaimType] NVARCHAR(MAX) NULL,
                    [ClaimValue] NVARCHAR(MAX) NULL,
                    CONSTRAINT [PK_AspNetUserClaims] PRIMARY KEY ([Id]),
                    CONSTRAINT [FK_AspNetUserClaims_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
                );
                CREATE INDEX [IX_AspNetUserClaims_UserId] ON [AspNetUserClaims] ([UserId]);
            ");

            // Recreate AspNetUserLogins
            migrationBuilder.Sql(@"
                CREATE TABLE [AspNetUserLogins] (
                    [LoginProvider] NVARCHAR(450) NOT NULL,
                    [ProviderKey] NVARCHAR(450) NOT NULL,
                    [ProviderDisplayName] NVARCHAR(MAX) NULL,
                    [UserId] INT NOT NULL,
                    CONSTRAINT [PK_AspNetUserLogins] PRIMARY KEY ([LoginProvider], [ProviderKey]),
                    CONSTRAINT [FK_AspNetUserLogins_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
                );
                CREATE INDEX [IX_AspNetUserLogins_UserId] ON [AspNetUserLogins] ([UserId]);
            ");

            // Recreate AspNetUserRoles
            migrationBuilder.Sql(@"
                CREATE TABLE [AspNetUserRoles] (
                    [UserId] INT NOT NULL,
                    [RoleId] INT NOT NULL,
                    CONSTRAINT [PK_AspNetUserRoles] PRIMARY KEY ([UserId], [RoleId]),
                    CONSTRAINT [FK_AspNetUserRoles_AspNetRoles_RoleId] FOREIGN KEY ([RoleId]) REFERENCES [AspNetRoles] ([Id]) ON DELETE CASCADE,
                    CONSTRAINT [FK_AspNetUserRoles_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
                );
                CREATE INDEX [IX_AspNetUserRoles_RoleId] ON [AspNetUserRoles] ([RoleId]);
            ");

            // Recreate AspNetUserTokens
            migrationBuilder.Sql(@"
                CREATE TABLE [AspNetUserTokens] (
                    [UserId] INT NOT NULL,
                    [LoginProvider] NVARCHAR(450) NOT NULL,
                    [Name] NVARCHAR(450) NOT NULL,
                    [Value] NVARCHAR(MAX) NULL,
                    CONSTRAINT [PK_AspNetUserTokens] PRIMARY KEY ([UserId], [LoginProvider], [Name]),
                    CONSTRAINT [FK_AspNetUserTokens_AspNetUsers_UserId] FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE CASCADE
                );
            ");

            // Re-add foreign key from AuditLogs to AspNetUsers
            migrationBuilder.Sql(@"
                ALTER TABLE [AuditLogs]
                ADD CONSTRAINT [FK_AuditLogs_AspNetUsers_UserId]
                FOREIGN KEY ([UserId]) REFERENCES [AspNetUsers] ([Id]) ON DELETE SET NULL;
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(@"
                IF EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_AuditLogs_AspNetUsers_UserId')
                    ALTER TABLE [AuditLogs] DROP CONSTRAINT [FK_AuditLogs_AspNetUsers_UserId];

                IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_AuditLogs_UserId' AND object_id = OBJECT_ID('AuditLogs'))
                    DROP INDEX [IX_AuditLogs_UserId] ON [AuditLogs];
                
                UPDATE [AuditLogs] SET [UserId] = NULL;
                ALTER TABLE [AuditLogs] ALTER COLUMN [UserId] NVARCHAR(450) NULL;

                CREATE INDEX [IX_AuditLogs_UserId] ON [AuditLogs] ([UserId]);

                DROP TABLE IF EXISTS [AspNetUserTokens];
                DROP TABLE IF EXISTS [AspNetUserRoles];
                DROP TABLE IF EXISTS [AspNetUserLogins];
                DROP TABLE IF EXISTS [AspNetUserClaims];
                DROP TABLE IF EXISTS [AspNetRoleClaims];
                DROP TABLE IF EXISTS [AspNetUsers];
                DROP TABLE IF EXISTS [AspNetRoles];
            ");
        }
    }
}
