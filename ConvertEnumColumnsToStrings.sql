-- =========================================================================================
-- SQL Migration Script: Convert TransactionType and AlertType from INT to NVARCHAR(50)
-- Matches exact UI strings:
--   Stock Transactions: 'Stock In', 'Stock Out', 'Adjustment', 'Transfer'
--   Alerts:             'Low Stock', 'Near Expiry', 'Expired', 'Stock Out'
-- =========================================================================================

-- 1. Drop existing indexes that depend on the columns
IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_StockTransactions_TransactionType' AND object_id = OBJECT_ID('StockTransactions'))
BEGIN
    DROP INDEX [IX_StockTransactions_TransactionType] ON [StockTransactions];
    PRINT 'Dropped index IX_StockTransactions_TransactionType.';
END
GO

IF EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_Alerts_AlertType' AND object_id = OBJECT_ID('Alerts'))
BEGIN
    DROP INDEX [IX_Alerts_AlertType] ON [Alerts];
    PRINT 'Dropped index IX_Alerts_AlertType.';
END
GO

-- 2. Alter column types from INT to NVARCHAR(50)
ALTER TABLE [StockTransactions] ALTER COLUMN [TransactionType] NVARCHAR(50) NOT NULL;
PRINT 'Altered StockTransactions.TransactionType to NVARCHAR(50).';
GO

ALTER TABLE [Alerts] ALTER COLUMN [AlertType] NVARCHAR(50) NOT NULL;
PRINT 'Altered Alerts.AlertType to NVARCHAR(50).';
GO

-- 3. Update existing records to exact descriptive strings
-- Stock Transactions
UPDATE [StockTransactions] SET [TransactionType] = 'Stock In' WHERE [TransactionType] IN ('1', 'StockIn');
UPDATE [StockTransactions] SET [TransactionType] = 'Stock Out' WHERE [TransactionType] IN ('2', 'StockOut');
UPDATE [StockTransactions] SET [TransactionType] = 'Adjustment' WHERE [TransactionType] IN ('3', 'Adjustment');
UPDATE [StockTransactions] SET [TransactionType] = 'Transfer' WHERE [TransactionType] IN ('4', 'Transfer');
PRINT 'Updated StockTransactions records to descriptive string values.';
GO

-- Alerts
UPDATE [Alerts] SET [AlertType] = 'Low Stock' WHERE [AlertType] IN ('1', 'LowStock');
UPDATE [Alerts] SET [AlertType] = 'Near Expiry' WHERE [AlertType] IN ('2', 'NearExpiry');
UPDATE [Alerts] SET [AlertType] = 'Expired' WHERE [AlertType] IN ('3', 'Expired');
UPDATE [Alerts] SET [AlertType] = 'Stock Out' WHERE [AlertType] IN ('4', 'StockOut');
PRINT 'Updated Alerts records to descriptive string values.';
GO

-- 4. Re-create the indexes
CREATE NONCLUSTERED INDEX [IX_StockTransactions_TransactionType] ON [StockTransactions] ([TransactionType]);
PRINT 'Recreated index IX_StockTransactions_TransactionType.';
GO

CREATE NONCLUSTERED INDEX [IX_Alerts_AlertType] ON [Alerts] ([AlertType]);
PRINT 'Recreated index IX_Alerts_AlertType.';
GO

-- 5. Record the migration in __EFMigrationsHistory so EF Core is in sync
IF NOT EXISTS (SELECT 1 FROM [__EFMigrationsHistory] WHERE [MigrationId] = '20261027083000_StoreEnumStringsForTransactionsAndAlerts')
BEGIN
    INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
    VALUES ('20261027083000_StoreEnumStringsForTransactionsAndAlerts', '8.0.20');
    PRINT 'Inserted migration record into __EFMigrationsHistory.';
END
GO

PRINT 'Migration complete! Verify with:';
PRINT 'SELECT Id, TransactionType, Quantity, Reason FROM StockTransactions;';
PRINT 'SELECT Id, AlertType, Message FROM Alerts;';
GO
