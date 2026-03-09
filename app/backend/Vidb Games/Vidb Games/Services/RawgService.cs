using Vidb_Games.Data;
using Vidb_Games.Services.Interfaces;
using System.Text.Json;
using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services
{
    public class RawgService : IRawgService
    {
        private AppDbContext _context;
        private IConfiguration _configuration;
        private HttpClient _httpClient = new HttpClient();

        public RawgService(AppDbContext context, IConfiguration configuration, HttpClient httpClient)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = httpClient;
        }

        private async Task<RawgDto?> SendRequestAsync(string endpoint, string queryParams)
        {
            var url = $"https://api.rawg.io/api/{endpoint}?key={_configuration["Rawg:ApiKey"]}&{queryParams}";

            var response = await _httpClient.GetStringAsync(url);
            return JsonSerializer.Deserialize<RawgDto>(response);
        }

        public async Task<RawgDto?> GetLastYearGames()
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var lastYear = DateTime.UtcNow.AddYears(-1).ToString("yyyy-MM-dd");

            var queryParams = $"dates={lastYear},{today}&ordering=-added&page_size=10";
            return await SendRequestAsync("games", queryParams);
        }

        public async Task<RawgDto?> GetUpcomingGames()
        {
            var today= DateTime.UtcNow.ToString("yyyy-MM-dd");
            var nextYear = DateTime.UtcNow.AddYears(1).ToString("yyyy-MM-dd");

            var queryParams = $"dates={today},{nextYear}&ordering=-added&page_size=10";
            return await SendRequestAsync("games", queryParams);
        }

        public async Task<RawgDto?> GetTopAllTimes()
        {
            var queryParams = $"ordering=-metacritic&page_size=40";

            var response = await SendRequestAsync("games", queryParams);

            if (response?.Results == null) return null;

            var cleanList = response.Results
                .Where(g => g.MetacriticScore.HasValue && g.RatingCounts > 200)
                .GroupBy(g => g.Name.ToLower())
                .Select(group => group.OrderByDescending(g => g.RatingCounts).First())
                .Take(10)
                .ToList();

            return new RawgDto(response.Count, cleanList);
        }

        public async Task<RawgDto?> GetGamesPage(int page, int pageSize)
        {
            var queryParams = $"ordering=-metacritic&page_size={pageSize}&page={page}";
            return await SendRequestAsync("games", queryParams);
        }

        //private async void PopulateDatabase()
        //{
        //    var queryParams = $"ordering=-metacritic&page_size=40";
        //    var result = await SendRequestAsync("games", queryParams);
            
        //    foreach (var games in result) {

        //    }
        //}
    }
}
