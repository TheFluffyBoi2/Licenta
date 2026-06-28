using Vidb_Games.Data;
using Microsoft.EntityFrameworkCore;
using System.Globalization;
using Vidb_Games.Models.Entities;
using Vidb_Games.Models;

namespace Vidb_Games.Services
{
    public class WishlistService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly TimeSpan _interval = TimeSpan.FromMinutes(5);

        public WishlistService(IServiceScopeFactory scopeFactory)
        {
            _scopeFactory = scopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken);

            while (!stoppingToken.IsCancellationRequested)
            {
                await CheckDealsAsync();
                await Task.Delay(_interval, stoppingToken);
            }
        }

        private async Task CheckDealsAsync()
        {
            using var scope = _scopeFactory.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var cheapShark = scope.ServiceProvider.GetRequiredService<CheapSharkService>();

            var wishlistItems = await db.UserGameEntries
                .Where(u => u.Status == Models.Entities.GameStatus.Wishlist)
                .Join(
                    db.Games,
                    entry => entry.GameId,
                    game => game.Id,
                    (entry, game) => new
                    {
                        entry.UserId,
                        entry.GameId,
                        GameName = game.Name
                    }
                )
                .Where(x => x.GameName != null)
                .ToListAsync();

            if (!wishlistItems.Any()) return;

            foreach (var item in wishlistItems)
            {
                try
                {
                    var deals = await cheapShark.SearchDealsAsync(item.GameName!);
                    if (!deals.Any()) continue;

                    var bestDeal = deals
                        .OrderBy(d => decimal.Parse(d.SalePrice, CultureInfo.InvariantCulture))
                        .First();

                    var savings = (int)double.Parse(bestDeal.Savings, CultureInfo.InvariantCulture);

                    if (savings < 20) continue;

                    var storeName = await cheapShark.GetStoreNameAsync(bestDeal.StoreId);
                    var dealUrl = cheapShark.BuildStoreUrl(bestDeal);

                    var alreadyNotified = await db.Notifications.AnyAsync(n =>
                        n.UserId == item.UserId &&
                        n.GameId == item.GameId &&
                        n.StoreName == storeName &&
                        n.CreatedAt > DateTime.UtcNow.AddHours(-24));

                    if (alreadyNotified) continue;

                    db.Notifications.Add(new Notification
                    {
                        UserId = item.UserId,
                        GameId = item.GameId,
                        GameName = item.GameName!,
                        StoreName = storeName,
                        SalePrice = decimal.Parse(bestDeal.SalePrice, CultureInfo.InvariantCulture),
                        NormalPrice = decimal.Parse(bestDeal.NormalPrice, CultureInfo.InvariantCulture),
                        SavingsPercent = savings,
                        DealUrl = dealUrl,
                        IsRead = false,
                        CreatedAt = DateTime.UtcNow
                    });

                    await Task.Delay(200);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Deal check failed for {item.GameName}: {ex.Message}");
                }
            }

            await db.SaveChangesAsync();
        }
    }
}
