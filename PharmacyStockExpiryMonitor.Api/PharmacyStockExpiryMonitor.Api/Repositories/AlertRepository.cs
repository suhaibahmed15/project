using Microsoft.EntityFrameworkCore;
using PharmacyStockExpiryMonitor.Api.Data;
using PharmacyStockExpiryMonitor.Api.Entities;
using PharmacyStockExpiryMonitor.Api.Repositories.Interfaces;

namespace PharmacyStockExpiryMonitor.Api.Repositories
{
    public class AlertRepository : IAlertRepository
    {
        private readonly ApplicationDbContext _context;

        public AlertRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<List<Alert>> GetAllAsync()
        {
            return await _context.Alerts
                .Include(a => a.Medicine)
                .Include(a => a.Batch)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Alert>> GetActiveAsync()
        {
            return await _context.Alerts
                .Include(a => a.Medicine)
                .Include(a => a.Batch)
                .Where(a => !a.IsResolved)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Alert>> GetUnreadAsync()
        {
            return await _context.Alerts
                .Include(a => a.Medicine)
                .Include(a => a.Batch)
                .Where(a =>
                    !a.IsRead &&
                    !a.IsResolved)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<Alert?> GetByIdAsync(int id)
        {
            return await _context.Alerts
                .Include(a => a.Medicine)
                .Include(a => a.Batch)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<List<Alert>> GetByMedicineIdAsync(
            int medicineId)
        {
            return await _context.Alerts
                .Include(a => a.Medicine)
                .Include(a => a.Batch)
                .Where(a => a.MedicineId == medicineId)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<Alert> AddAsync(Alert alert)
        {
            await _context.Alerts.AddAsync(alert);
            await _context.SaveChangesAsync();

            return alert;
        }

        public async Task UpdateAsync(Alert alert)
        {
            _context.Alerts.Update(alert);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Batch>> GetExpiringBatchesAsync(DateTime thresholdDate)
        {
            return await _context.Batches
                .Include(b => b.Medicine)
                .Where(b => !b.IsDeleted && b.RemainingQuantity > 0 && b.ExpiryDate <= thresholdDate)
                .OrderBy(b => b.ExpiryDate)
                .ToListAsync();
        }

        public async Task<List<Alert>> GetAlertsForBatchesAsync(IEnumerable<int> batchIds)
        {
            var ids = batchIds.Distinct().ToList();
            return await _context.Alerts
                .Where(a => a.BatchId.HasValue && ids.Contains(a.BatchId.Value))
                .ToListAsync();
        }

        public async Task AddRangeAsync(IEnumerable<Alert> alerts)
        {
            await _context.Alerts.AddRangeAsync(alerts);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateRangeAsync(IEnumerable<Alert> alerts)
        {
            _context.Alerts.UpdateRange(alerts);
            await _context.SaveChangesAsync();
        }
    }
}