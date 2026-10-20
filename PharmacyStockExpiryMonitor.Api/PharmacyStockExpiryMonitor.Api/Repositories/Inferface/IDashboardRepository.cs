using PharmacyStockExpiryMonitor.Api.DTOs.Dashboard;

namespace PharmacyStockExpiryMonitor.Api.Repositories.Interfaces
{
    public interface IDashboardRepository
    {
        Task<int> GetTotalMedicinesAsync();

        Task<int> GetTotalCategoriesAsync();

        Task<int> GetTotalSuppliersAsync();

        Task<int> GetTotalBatchesAsync();

        Task<int> GetLowStockCountAsync();

        Task<int> GetNearExpiryCountAsync();

        Task<int> GetExpiredCountAsync();

        Task<int> GetUnreadAlertsCountAsync();

        Task<decimal> GetTotalPurchaseAmountAsync();

        Task<decimal> GetTotalStockValueAsync();

        Task<int> GetTotalStockUnitsAsync();

        Task<List<StockLedgerChartPointDto>> GetStockLedgerChartDataAsync();

        Task<DashboardSummaryDto> GetSummaryAsync();
    }
}