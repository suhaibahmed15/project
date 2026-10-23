using Microsoft.EntityFrameworkCore;
using PharmacyStockExpiryMonitor.Api.Data;
using PharmacyStockExpiryMonitor.Api.DTOs.StockTransaction;
using PharmacyStockExpiryMonitor.Api.Entities;
using PharmacyStockExpiryMonitor.Api.Enums;
using PharmacyStockExpiryMonitor.Api.Repositories.Interfaces;
using PharmacyStockExpiryMonitor.Api.Services.Interfaces;

namespace PharmacyStockExpiryMonitor.Api.Services
{
    public class StockTransactionService :
        IStockTransactionService
    {
        private readonly IStockTransactionRepository _repository;
        private readonly IBatchRepository _batchRepository;
        private readonly ApplicationDbContext _context;

        public StockTransactionService(
            IStockTransactionRepository repository,
            IBatchRepository batchRepository,
            ApplicationDbContext context)
        {
            _repository = repository;
            _batchRepository = batchRepository;
            _context = context;
        }

        private async Task<Dictionary<string, string>> GetUserFullNameMapAsync()
        {
            try
            {
                var users = await _context.Users
                    .AsNoTracking()
                    .Select(u => new { u.Id, u.FullName, u.UserName })
                    .ToListAsync();

                var map = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                foreach (var u in users)
                {
                    var displayName = !string.IsNullOrWhiteSpace(u.FullName)
                        ? u.FullName
                        : (!string.IsNullOrWhiteSpace(u.UserName) ? u.UserName : $"User #{u.Id}");

                    map[u.Id.ToString()] = displayName;

                    if (!string.IsNullOrWhiteSpace(u.UserName) && !map.ContainsKey(u.UserName))
                    {
                        map[u.UserName] = displayName;
                    }
                }
                return map;
            }
            catch
            {
                return new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
            }
        }

        private static string ResolveUserFullName(string? createdBy, Dictionary<string, string> userMap)
        {
            if (string.IsNullOrWhiteSpace(createdBy))
                return "System";

            if (userMap.TryGetValue(createdBy, out var fullName))
                return fullName;

            if (createdBy == "1") return "System Administrator";
            if (createdBy == "2") return "Store Manager";
            if (createdBy == "3") return "Lead Pharmacist";

            return createdBy;
        }

        public async Task<List<StockTransactionDto>> GetAllAsync()
        {
            var transactions =
                await _repository.GetAllAsync();

            var userMap = await GetUserFullNameMapAsync();

            return transactions.Select(transaction =>
            {
                var userFullName = ResolveUserFullName(transaction.CreatedBy, userMap);

                return new StockTransactionDto
                {
                    Id = transaction.Id,
                    MedicineId = transaction.MedicineId,
                    BatchId = transaction.BatchId,
                    TransactionType =
                        transaction.TransactionType,
                    Quantity = transaction.Quantity,
                    PreviousQuantity =
                        transaction.PreviousQuantity,
                    NewQuantity =
                        transaction.NewQuantity,
                    Reason = transaction.Reason,
                    IsAdminOverride =
                        transaction.IsAdminOverride,
                    CreatedAt = transaction.CreatedAt,
                    CreatedBy = transaction.CreatedBy,
                    CreatedByName = userFullName,
                    UserFullName = userFullName,
                    UpdatedAt = transaction.UpdatedAt,
                    UpdatedBy = transaction.UpdatedBy
                };
            }).ToList();
        }

        public async Task<StockTransactionDto?> GetByIdAsync(
            int id)
        {
            var transaction =
                await _repository.GetByIdAsync(id);

            if (transaction == null)
                return null;

            var userMap = await GetUserFullNameMapAsync();
            var userFullName = ResolveUserFullName(transaction.CreatedBy, userMap);

            return new StockTransactionDto
            {
                Id = transaction.Id,
                MedicineId = transaction.MedicineId,
                BatchId = transaction.BatchId,
                TransactionType =
                    transaction.TransactionType,
                Quantity = transaction.Quantity,
                PreviousQuantity =
                    transaction.PreviousQuantity,
                NewQuantity =
                    transaction.NewQuantity,
                Reason = transaction.Reason,
                IsAdminOverride =
                    transaction.IsAdminOverride,
                CreatedAt = transaction.CreatedAt,
                CreatedBy = transaction.CreatedBy,
                CreatedByName = userFullName,
                UserFullName = userFullName,
                UpdatedAt = transaction.UpdatedAt,
                UpdatedBy = transaction.UpdatedBy
            };
        }

        public async Task<StockTransactionDto> CreateAsync(
            CreateStockTransactionDto dto)
        {
            if (dto.Quantity <= 0)
                throw new Exception(
                    "Quantity must be greater than zero.");

            var batch =
                await _batchRepository.GetByIdAsync(
                    dto.BatchId);

            if (batch == null)
                throw new Exception("Batch not found.");

            if (dto.TransactionType ==
                StockTransactionType.Adjustment &&
                !dto.IsAdminOverride)
            {
                throw new Exception(
                    "Adjustment requires admin override.");
            }

            var previousQuantity =
                batch.RemainingQuantity;

            var newQuantity = previousQuantity;

            if (dto.TransactionType ==
                StockTransactionType.StockIn)
            {
                newQuantity =
                    previousQuantity + dto.Quantity;
            }
            else if (dto.TransactionType ==
                     StockTransactionType.StockOut)
            {
                newQuantity =
                    previousQuantity - dto.Quantity;

                if (newQuantity < 0)
                    throw new Exception(
                        "Insufficient stock.");
            }
            else if (dto.TransactionType ==
                     StockTransactionType.Adjustment)
            {
                newQuantity = dto.Quantity;
            }

            batch.RemainingQuantity = newQuantity;

            await _batchRepository.UpdateAsync(batch);

            var transaction = new StockTransaction
            {
                MedicineId = batch.MedicineId,
                BatchId = batch.Id,
                TransactionType = dto.TransactionType,
                Quantity = dto.Quantity,
                PreviousQuantity = previousQuantity,
                NewQuantity = newQuantity,
                Reason = dto.Reason,
                IsAdminOverride = dto.IsAdminOverride,
                CreatedAt = DateTime.UtcNow
            };

            var createdTransaction =
                await _repository.AddAsync(transaction);

            var userMap = await GetUserFullNameMapAsync();
            var userFullName = ResolveUserFullName(createdTransaction.CreatedBy, userMap);

            return new StockTransactionDto
            {
                Id = createdTransaction.Id,
                MedicineId =
                    createdTransaction.MedicineId,
                BatchId =
                    createdTransaction.BatchId,
                TransactionType =
                    createdTransaction.TransactionType,
                Quantity =
                    createdTransaction.Quantity,
                PreviousQuantity =
                    createdTransaction.PreviousQuantity,
                NewQuantity =
                    createdTransaction.NewQuantity,
                Reason =
                    createdTransaction.Reason,
                IsAdminOverride =
                    createdTransaction.IsAdminOverride,
                CreatedAt =
                    createdTransaction.CreatedAt,
                CreatedBy =
                    createdTransaction.CreatedBy,
                CreatedByName =
                    userFullName,
                UserFullName =
                    userFullName,
                UpdatedAt =
                    createdTransaction.UpdatedAt,
                UpdatedBy =
                    createdTransaction.UpdatedBy
            };
        }
    }
}