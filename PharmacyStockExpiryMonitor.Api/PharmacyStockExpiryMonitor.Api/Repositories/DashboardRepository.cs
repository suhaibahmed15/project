using Microsoft.EntityFrameworkCore;
using PharmacyStockExpiryMonitor.Api.Data;
using PharmacyStockExpiryMonitor.Api.DTOs.Dashboard;
using PharmacyStockExpiryMonitor.Api.Repositories.Interfaces;

namespace PharmacyStockExpiryMonitor.Api.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly ApplicationDbContext _context;

        public DashboardRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<int> GetTotalMedicinesAsync()
        {
            return await _context.Medicines
                .CountAsync(m => !m.IsDeleted);
        }

        public async Task<int> GetTotalCategoriesAsync()
        {
            return await _context.Categories
                .CountAsync(c => !c.IsDeleted);
        }

        public async Task<int> GetTotalSuppliersAsync()
        {
            return await _context.Suppliers
                .CountAsync(s => !s.IsDeleted);
        }

        public async Task<int> GetTotalBatchesAsync()
        {
            return await _context.Batches
                .CountAsync(b => !b.IsDeleted);
        }

        public async Task<int> GetLowStockCountAsync()
        {
            return await _context.Medicines
                .Where(m => !m.IsDeleted)
                .CountAsync(m =>
                    m.Batches
                        .Where(b => !b.IsDeleted)
                        .Sum(b => b.RemainingQuantity)
                    <= m.ReorderLevel);
        }

        public async Task<int> GetNearExpiryCountAsync()
        {
            var today = DateTime.UtcNow.Date;
            var expiryDate = today.AddDays(30);

            return await _context.Batches
                .CountAsync(b =>
                    !b.IsDeleted &&
                    b.RemainingQuantity > 0 &&
                    b.ExpiryDate >= today &&
                    b.ExpiryDate <= expiryDate);
        }

        public async Task<int> GetExpiredCountAsync()
        {
            var today = DateTime.UtcNow.Date;

            return await _context.Batches
                .CountAsync(b =>
                    !b.IsDeleted &&
                    b.ExpiryDate < today &&
                    b.RemainingQuantity > 0);
        }

        public async Task<int> GetUnreadAlertsCountAsync()
        {
            return await _context.Alerts
                .CountAsync(a =>
                    !a.IsRead &&
                    !a.IsResolved);
        }

        public async Task<decimal> GetTotalPurchaseAmountAsync()
        {
            return await _context.Purchases
                .Where(p => !p.IsDeleted)
                .SumAsync(p => (decimal?)p.TotalAmount) ?? 0;
        }

        public async Task<decimal> GetTotalStockValueAsync()
        {
            return await _context.Batches
                .Where(b => !b.IsDeleted && b.RemainingQuantity > 0)
                .SumAsync(b => (decimal?)((decimal)b.RemainingQuantity * b.UnitCost)) ?? 0;
        }

        public async Task<int> GetTotalStockUnitsAsync()
        {
            return await _context.Batches
                .Where(b => !b.IsDeleted)
                .SumAsync(b => (int?)b.RemainingQuantity) ?? 0;
        }

        public async Task<List<StockLedgerChartPointDto>> GetStockLedgerChartDataAsync()
        {
            var today = DateTime.UtcNow.Date;

            // Find the most recent transaction date to anchor the timeline (default to today)
            var latestTxDate = await _context.StockTransactions
                .OrderByDescending(t => t.CreatedAt)
                .Select(t => (DateTime?)t.CreatedAt)
                .FirstOrDefaultAsync();

            var refDate = latestTxDate.HasValue ? latestTxDate.Value.Date : today;
            var monthStart = new DateTime(refDate.Year, refDate.Month, 1, 0, 0, 0, DateTimeKind.Utc);
            var monthEnd = monthStart.AddMonths(1);

            // Fetch transactions for the current month (e.g. October 2026)
            var transactions = await _context.StockTransactions
                .Where(t => t.CreatedAt >= monthStart && t.CreatedAt < monthEnd)
                .Select(t => new
                {
                    t.TransactionType,
                    t.Quantity,
                    t.CreatedAt
                })
                .ToListAsync();

            // Collect active transaction dates in this month
            var dates = transactions
                .Select(t => t.CreatedAt.Date)
                .Distinct()
                .ToList();

            // Ensure recent days leading to refDate are included
            for (int d = 4; d >= 0; d--)
            {
                var candidate = refDate.AddDays(-d);
                if (candidate >= monthStart && candidate < monthEnd && !dates.Contains(candidate))
                {
                    dates.Add(candidate);
                }
            }

            var sortedDates = dates.OrderBy(d => d).ToList();
            var chartPoints = new List<StockLedgerChartPointDto>();

            foreach (var day in sortedDates)
            {
                var nextDay = day.AddDays(1);
                var dayTx = transactions
                    .Where(t => t.CreatedAt >= day && t.CreatedAt < nextDay)
                    .ToList();

                var stockIn = dayTx
                    .Where(t => t.TransactionType == Enums.StockTransactionType.StockIn)
                    .Sum(t => t.Quantity);

                var stockOut = dayTx
                    .Where(t => t.TransactionType == Enums.StockTransactionType.StockOut)
                    .Sum(t => t.Quantity);

                var adjustments = dayTx
                    .Where(t => t.TransactionType == Enums.StockTransactionType.Adjustment ||
                                t.TransactionType == Enums.StockTransactionType.Transfer)
                    .Sum(t => t.Quantity);

                chartPoints.Add(new StockLedgerChartPointDto
                {
                    Period = day.ToString("MMMM dd"), // e.g. "October 23"
                    StockIn = stockIn,
                    StockOut = stockOut,
                    Adjustments = adjustments,
                    TotalTransactions = dayTx.Count
                });
            }

            return chartPoints;
        }

        public async Task<DashboardSummaryDto> GetSummaryAsync()
        {
            return new DashboardSummaryDto
            {
                TotalMedicines =
                    await GetTotalMedicinesAsync(),

                TotalCategories =
                    await GetTotalCategoriesAsync(),

                TotalSuppliers =
                    await GetTotalSuppliersAsync(),

                TotalBatches =
                    await GetTotalBatchesAsync(),

                LowStockCount =
                    await GetLowStockCountAsync(),

                NearExpiryCount =
                    await GetNearExpiryCountAsync(),

                ExpiredCount =
                    await GetExpiredCountAsync(),

                UnreadAlertsCount =
                    await GetUnreadAlertsCountAsync(),

                TotalPurchaseAmount =
                    await GetTotalPurchaseAmountAsync(),

                TotalStockValue =
                    await GetTotalStockValueAsync(),

                TotalStockUnits =
                    await GetTotalStockUnitsAsync(),

                StockLedgerData =
                    await GetStockLedgerChartDataAsync()
            };
        }
    }
}