using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Http;
using PharmacyStockExpiryMonitor.Api.Data;
using PharmacyStockExpiryMonitor.Api.Entities;
using PharmacyStockExpiryMonitor.Api.Services.Interfaces;

namespace PharmacyStockExpiryMonitor.Api.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly ApplicationDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;

    public AuditLogService(
        ApplicationDbContext context,
        IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task LogAsync(
            string action,
            string entityName,
            string? entityId = null,
            string? oldValues = null,
            string? newValues = null)
        {
            var httpContext = _httpContextAccessor.HttpContext;
            int? parsedEntityId = int.TryParse(entityId, out var parsedId) ? parsedId : null;

            var auditLog = new AuditLog
            {
                UserId = int.TryParse(
                    httpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier),
                    out var parsedUserId)
                        ? parsedUserId
                        : (entityName.Equals("User", StringComparison.OrdinalIgnoreCase) ? parsedEntityId : null),

                MedicineId = entityName.Equals("Medicine", StringComparison.OrdinalIgnoreCase) ? parsedEntityId : null,
                BatchId = entityName.Equals("Batch", StringComparison.OrdinalIgnoreCase) ? parsedEntityId : null,
                PurchaseId = entityName.Equals("Purchase", StringComparison.OrdinalIgnoreCase) ? parsedEntityId : null,
                SupplierId = entityName.Equals("Supplier", StringComparison.OrdinalIgnoreCase) ? parsedEntityId : null,
                CategoryId = entityName.Equals("Category", StringComparison.OrdinalIgnoreCase) ? parsedEntityId : null,

                Action = action,
                EntityName = entityName,
                EntityId = entityId,
                OldValues = oldValues,
                NewValues = newValues,

                IpAddress = httpContext?.Connection
                    .RemoteIpAddress?.ToString(),

                CreatedAt = DateTime.UtcNow
            };

            _context.AuditLogs.Add(auditLog);

            await _context.SaveChangesAsync();
        }

        public Task LogJsonAsync(
            string action,
            string entityName,
            string? entityId,
            object? oldValues,
            object? newValues)
        {
            return LogAsync(
                action,
                entityName,
                entityId,
                oldValues == null
                    ? null
                    : JsonSerializer.Serialize(oldValues),
                newValues == null
                    ? null
                    : JsonSerializer.Serialize(newValues));
        }
    }


}
