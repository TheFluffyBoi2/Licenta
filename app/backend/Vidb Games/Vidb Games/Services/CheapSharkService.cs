using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services
{
    public class CheapSharkService
    {
        private readonly HttpClient _httpClient;
        private const string BaseUrl = "https://www.cheapshark.com/api/1.0";
        private Dictionary<string, string>? _storeNames;

        public CheapSharkService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<List<CheapSharkDealDto>> SearchDealsAsync(string gameTitle)
        {
            var url = $"{BaseUrl}/deals?title={Uri.EscapeDataString(gameTitle)}&onSale=1&sortBy=Price&pageSize=5";
            var response = await _httpClient.GetFromJsonAsync<List<CheapSharkDealDto>>(url);
            return response ?? new List<CheapSharkDealDto>();
        }

        public async Task<string> GetStoreNameAsync(string storeId)
        {
            _storeNames ??= await LoadStoresAsync();
            return _storeNames.TryGetValue(storeId, out var name) ? name : "Unknown Store";
        }

        public string BuildStoreUrl(CheapSharkDealDto deal)
        {
            var slug = ExtractSlug(deal.MetacriticLink);

            var directUrl = deal.StoreId switch
            {
                "1" when HasSteamAppId(deal.SteamAppId) =>
                    $"https://store.steampowered.com/app/{deal.SteamAppId}",
                "7" when slug != null =>
                    $"https://www.gog.com/en/game/{slug.Replace('-', '_')}",
                "25" when slug != null =>
                    $"https://store.epicgames.com/en-US/p/{slug}",
                "11" when slug != null =>
                    $"https://www.humblebundle.com/store/{slug}",
                "3" when slug != null =>
                    $"https://www.greenmangaming.com/games/{slug}-pc",
                "15" when slug != null =>
                    $"https://www.fanatical.com/en/game/{slug}",
                "13" when slug != null =>
                    $"https://store.ubisoft.com/us/game/{slug}",
                _ => null
            };

            return directUrl ?? BuildCheapSharkRedirectUrl(deal.DealId);
        }

        private static string BuildCheapSharkRedirectUrl(string dealId) =>
            $"https://www.cheapshark.com/redirect?dealID={dealId}";

        private static bool HasSteamAppId(string? steamAppId) =>
            !string.IsNullOrWhiteSpace(steamAppId) && steamAppId != "0";

        private static string? ExtractSlug(string? metacriticLink)
        {
            if (string.IsNullOrWhiteSpace(metacriticLink)) return null;

            var segments = metacriticLink.Trim('/').Split('/', StringSplitOptions.RemoveEmptyEntries);
            return segments.Length > 0 ? segments[^1] : null;
        }

        private async Task<Dictionary<string, string>> LoadStoresAsync()
        {
            var stores = await _httpClient.GetFromJsonAsync<List<CheapSharkStoreDto>>($"{BaseUrl}/stores");
            return stores?.ToDictionary(s => s.StoreId, s => s.StoreName)
                ?? new Dictionary<string, string>();
        }
    }
}
