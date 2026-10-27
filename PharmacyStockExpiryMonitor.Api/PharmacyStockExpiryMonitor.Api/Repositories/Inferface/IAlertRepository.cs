using PharmacyStockExpiryMonitor.Api.Entities;

namespace PharmacyStockExpiryMonitor.Api.Repositories.Interfaces
{
    public interface IAlertRepository
    {
        Task<List<Alert>> GetAllAsync();

        Task<List<Alert>> GetActiveAsync();

        Task<List<Alert>> GetUnreadAsync();

        Task<Alert?> GetByIdAsync(int id);

        Task<List<Alert>> GetByMedicineIdAsync(
            int medicineId);

        Task<Alert> AddAsync(Alert alert);

        Task UpdateAsync(Alert alert);

        Task<List<Batch>> GetExpiringBatchesAsync(DateTime thresholdDate);

        Task<List<Alert>> GetAlertsForBatchesAsync(IEnumerable<int> batchIds);

        Task AddRangeAsync(IEnumerable<Alert> alerts);

        Task UpdateRangeAsync(IEnumerable<Alert> alerts);
    }
}