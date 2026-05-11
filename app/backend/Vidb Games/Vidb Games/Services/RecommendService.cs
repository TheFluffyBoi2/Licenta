using Microsoft.EntityFrameworkCore;
using Vidb_Games.Data;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Models.Entities;
using Vidb_Games.Services.Interfaces;
using System.Net.Http;

namespace Vidb_Games.Services
{
    public class RecommendService : IRecommendService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IIGDBService _igdbService;
        private readonly HttpClient _httpClient;

        public RecommendService(AppDbContext context, IConfiguration configuration, IIGDBService igdbService, HttpClient httpClient)
        {
            _configuration = configuration;
            _context = context;
            _igdbService = igdbService;
            _httpClient = httpClient;
        }

        public async Task<GameDto[]?> GetUserRecommendations(Guid userId)
        {
            List<long> gameIds = await _context.UserGameEntries
                .Where(ug => ug.UserId == userId)
                .Select(ug => ug.GameId)
                .ToListAsync();

            var requestBody = new UserRecommendationRequest
            {
                GameIds = gameIds
            };

            var response = await _httpClient.PostAsJsonAsync(
                "http://fastapi_recommender:8000/recommendations/user",
                requestBody
            );

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("FastAPI request failed.");
            }

            GameDto[]? result = await response.Content.ReadFromJsonAsync<GameDto[]>();

            if (result == null || result.Length == 0)
            {
                return Array.Empty<GameDto>();
            }

            var ids = result.Select(g => g.IgdbId).ToList();
            string idString = string.Join(",", ids);

            string queryParams = $"fields name, slug, summary, cover.url, first_release_date, genres.name, platforms.name; " +
                                 $"where id = ({idString}); " +
                                 $"limit {ids.Count};";

            var finalGames = await _igdbService.SendRequestAsync(queryParams);

            return finalGames ?? Array.Empty<GameDto>();
        }

        public async Task<GameDto[]?> GetDescriptionRecommendations(string description)
        {
            var requestBody = new TextRecommendationRequest
            {
                Description = description
            };

            var response = await _httpClient.PostAsJsonAsync(
                "http://fastapi_recommender:8000/recommendations",
                requestBody
            );

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("FastAPI request failed.");
            }

            GameDto[]? result = await response.Content.ReadFromJsonAsync<GameDto[]>();

            if (result == null || result.Length == 0)
            {
                return Array.Empty<GameDto>();
            }

            var ids = result.Select(g => g.IgdbId).ToList();
            string idString = string.Join(",", ids);

            string queryParams = $"fields name, slug, summary, cover.url, first_release_date, genres.name, platforms.name; " +
                                 $"where id = ({idString}); " +
                                 $"limit {ids.Count};";

            var finalGames = await _igdbService.SendRequestAsync(queryParams);

            return finalGames ?? Array.Empty<GameDto>();
        }

        public async Task<GameDto[]?> GetGameRecommendations(long gameId)
        {
            var response = await _httpClient.GetFromJsonAsync<GameDto[]>(
                $"http://fastapi_recommender:8000/recommendations/game/{gameId}"
            );

            if (response == null || response.Length == 0)
            {
                return null;
            }

            return response ?? Array.Empty<GameDto>();
        }
    }
}
