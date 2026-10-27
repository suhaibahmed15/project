using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using PharmacyStockExpiryMonitor.Api.Services.Interfaces;

namespace PharmacyStockExpiryMonitor.Api.BackgroundServices
{
    public class ExpiryAlertBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ExpiryAlertBackgroundService> _logger;

        // Periodic scan interval: checks batches every 1 hour
        private static readonly TimeSpan ScanInterval = TimeSpan.FromHours(1);

        public ExpiryAlertBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<ExpiryAlertBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("ExpiryAlertBackgroundService is starting.");

            // Allow the application host to finish initialization before running initial check
            try
            {
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
            catch (OperationCanceledException)
            {
                return;
            }

            while (!stoppingToken.IsCancellationRequested)
            {
                try
                {
                    using var scope = _serviceProvider.CreateScope();
                    var alertService = scope.ServiceProvider.GetRequiredService<IAlertService>();

                    _logger.LogInformation("ExpiryAlertBackgroundService: Scanning inventory for expiring/expired batches...");
                    var generatedCount = await alertService.CheckAndGenerateExpiryAlertsAsync(force: true);

                    if (generatedCount > 0)
                    {
                        _logger.LogInformation("ExpiryAlertBackgroundService: Generated {Count} new batch expiry alert(s).", generatedCount);
                    }
                    else
                    {
                        _logger.LogInformation("ExpiryAlertBackgroundService: Batch expiry scan complete. No new alerts needed.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "ExpiryAlertBackgroundService: Error occurred during automatic batch expiry alert generation.");
                }

                try
                {
                    await Task.Delay(ScanInterval, stoppingToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
            }

            _logger.LogInformation("ExpiryAlertBackgroundService has stopped.");
        }
    }
}
