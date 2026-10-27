using PharmacyStockExpiryMonitor.Api.DTOs.Alert;
using PharmacyStockExpiryMonitor.Api.Entities;
using PharmacyStockExpiryMonitor.Api.Enums;
using PharmacyStockExpiryMonitor.Api.Repositories.Interfaces;
using PharmacyStockExpiryMonitor.Api.Services.Interfaces;

namespace PharmacyStockExpiryMonitor.Api.Services
{
    public class AlertService : IAlertService
    {
        private readonly IAlertRepository _repository;
        private static DateTime _lastAutoCheckUtc = DateTime.MinValue;
        private static readonly TimeSpan AutoCheckInterval = TimeSpan.FromMinutes(2);

        public AlertService(IAlertRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<AlertDto>> GetAllAsync()
        {
            if (DateTime.UtcNow - _lastAutoCheckUtc >= AutoCheckInterval)
            {
                try
                {
                    await CheckAndGenerateExpiryAlertsAsync(force: false);
                }
                catch
                {
                    // Fail silently so reading alerts is not blocked if auto-generation hits an issue
                }
            }

            var alerts = await _repository.GetAllAsync();

            return alerts.Select(alert => new AlertDto
            {
                Id = alert.Id,
                MedicineId = alert.MedicineId,
                MedicineName = alert.Medicine?.Name,
                BatchId = alert.BatchId,
                BatchNumber = alert.Batch?.BatchNumber,
                AlertType = alert.AlertType,
                Message = alert.Message,
                IsRead = alert.IsRead,
                IsResolved = alert.IsResolved,
                ResolvedAt = alert.ResolvedAt,
                CreatedAt = alert.CreatedAt,
                CreatedBy = alert.CreatedBy,
                UpdatedAt = alert.UpdatedAt,
                UpdatedBy = alert.UpdatedBy
            }).ToList();
        }

        public async Task<AlertDto?> GetByIdAsync(int id)
        {
            var alert = await _repository.GetByIdAsync(id);

            if (alert == null)
                return null;

            return new AlertDto
            {
                Id = alert.Id,
                MedicineId = alert.MedicineId,
                MedicineName = alert.Medicine?.Name,
                BatchId = alert.BatchId,
                BatchNumber = alert.Batch?.BatchNumber,
                AlertType = alert.AlertType,
                Message = alert.Message,
                IsRead = alert.IsRead,
                IsResolved = alert.IsResolved,
                ResolvedAt = alert.ResolvedAt,
                CreatedAt = alert.CreatedAt,
                CreatedBy = alert.CreatedBy,
                UpdatedAt = alert.UpdatedAt,
                UpdatedBy = alert.UpdatedBy
            };
        }

        public async Task<AlertDto> CreateAsync(
            int medicineId,
            int? batchId,
            AlertType alertType,
            string message)
        {
            var alert = new Alert
            {
                MedicineId = medicineId,
                BatchId = batchId,
                AlertType = alertType,
                Message = message,
                IsRead = false,
                IsResolved = false,
                CreatedAt = DateTime.UtcNow
            };

            var createdAlert =
                await _repository.AddAsync(alert);

            // Re-fetch to get navigation properties if needed
            var loaded = await _repository.GetByIdAsync(createdAlert.Id) ?? createdAlert;

            return new AlertDto
            {
                Id = loaded.Id,
                MedicineId = loaded.MedicineId,
                MedicineName = loaded.Medicine?.Name,
                BatchId = loaded.BatchId,
                BatchNumber = loaded.Batch?.BatchNumber,
                AlertType = loaded.AlertType,
                Message = loaded.Message,
                IsRead = loaded.IsRead,
                IsResolved = loaded.IsResolved,
                ResolvedAt = loaded.ResolvedAt,
                CreatedAt = loaded.CreatedAt,
                CreatedBy = loaded.CreatedBy,
                UpdatedAt = loaded.UpdatedAt,
                UpdatedBy = loaded.UpdatedBy
            };
        }

        public async Task<bool> MarkAsReadAsync(int id)
        {
            var alert = await _repository.GetByIdAsync(id);

            if (alert == null)
                return false;

            alert.IsRead = true;

            await _repository.UpdateAsync(alert);

            return true;
        }

        public async Task<bool> ResolveAsync(int id)
        {
            var alert = await _repository.GetByIdAsync(id);

            if (alert == null)
                return false;

            alert.IsResolved = true;
            alert.ResolvedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(alert);

            return true;
        }

        public async Task<int> CheckAndGenerateExpiryAlertsAsync(bool force = false)
        {
            _lastAutoCheckUtc = DateTime.UtcNow;

            var today = DateTime.UtcNow.Date;
            var nearExpiryThreshold = today.AddDays(30);

            var batches = await _repository.GetExpiringBatchesAsync(nearExpiryThreshold);
            if (batches == null || batches.Count == 0)
                return 0;

            var batchIds = batches.Select(b => b.Id).ToList();
            var existingAlerts = await _repository.GetAlertsForBatchesAsync(batchIds);

            var alertsToAdd = new List<Alert>();
            var alertsToUpdate = new List<Alert>();

            foreach (var batch in batches)
            {
                var isExpired = batch.ExpiryDate.Date < today;
                var medicineName = batch.Medicine?.Name ?? $"Medicine #{batch.MedicineId}";

                if (isExpired)
                {
                    // Transition any active NearExpiry alert for this batch to resolved
                    var activeNearExpiryAlerts = existingAlerts
                        .Where(a => a.BatchId == batch.Id && a.AlertType == AlertType.NearExpiry && !a.IsResolved)
                        .ToList();

                    foreach (var nearAlert in activeNearExpiryAlerts)
                    {
                        nearAlert.IsResolved = true;
                        nearAlert.ResolvedAt = DateTime.UtcNow;
                        if (!alertsToUpdate.Contains(nearAlert))
                        {
                            alertsToUpdate.Add(nearAlert);
                        }
                    }

                    // Check if an Expired alert has already been created for this batch
                    var alreadyHasExpiredAlert = existingAlerts
                        .Any(a => a.BatchId == batch.Id && a.AlertType == AlertType.Expired);

                    if (!alreadyHasExpiredAlert)
                    {
                        var newAlert = new Alert
                        {
                            MedicineId = batch.MedicineId,
                            BatchId = batch.Id,
                            AlertType = AlertType.Expired,
                            Message = $"Batch {batch.BatchNumber} of {medicineName} expired on {batch.ExpiryDate:yyyy-MM-dd} with {batch.RemainingQuantity} units remaining in stock.",
                            IsRead = false,
                            IsResolved = false,
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = "System"
                        };

                        alertsToAdd.Add(newAlert);
                        existingAlerts.Add(newAlert);
                    }
                }
                else
                {
                    // Near Expiry (within 30 days)
                    var alreadyHasNearExpiryAlert = existingAlerts
                        .Any(a => a.BatchId == batch.Id && a.AlertType == AlertType.NearExpiry);

                    if (!alreadyHasNearExpiryAlert)
                    {
                        var daysLeft = (batch.ExpiryDate.Date - today).Days;
                        var dayText = daysLeft == 0 ? "today" : daysLeft == 1 ? "in 1 day" : $"in {daysLeft} days";

                        var newAlert = new Alert
                        {
                            MedicineId = batch.MedicineId,
                            BatchId = batch.Id,
                            AlertType = AlertType.NearExpiry,
                            Message = $"Batch {batch.BatchNumber} of {medicineName} is expiring {dayText} on {batch.ExpiryDate:yyyy-MM-dd} with {batch.RemainingQuantity} units remaining in stock.",
                            IsRead = false,
                            IsResolved = false,
                            CreatedAt = DateTime.UtcNow,
                            CreatedBy = "System"
                        };

                        alertsToAdd.Add(newAlert);
                        existingAlerts.Add(newAlert);
                    }
                }
            }

            if (alertsToUpdate.Any())
            {
                await _repository.UpdateRangeAsync(alertsToUpdate);
            }

            if (alertsToAdd.Any())
            {
                await _repository.AddRangeAsync(alertsToAdd);
            }

            return alertsToAdd.Count;
        }
    }
}