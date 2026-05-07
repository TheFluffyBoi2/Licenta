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
        private readonly HttpClient _httpClinet;

        public RecommendService(AppDbContext context, IConfiguration configuration, IIGDBService igdbService, HttpClient httpClient)
        {
            _configuration = configuration;
            _context = context;
            _igdbService = igdbService;
            _httpClinet = httpClient;
        }

        public async Task<GameDto[]?> GetUserRecommendations(Guid userId)
        {
            List<long> gameIds = await _context.UserGameEntries
                .Where(ug => ug.UserId == userId)
                .Select(ug => ug.GameId)
                .ToListAsync();

            var response = await _httpClinet.PostAsJsonAsync(
                "http://localhost:8000/recommendations/user",
                new { gameIds }
            );

            if (!response.IsSuccessStatusCode)
            {
                throw new Exception("FastAPI request failed.");
            }

            GameDto[]? result = await response.Content.ReadFromJsonAsync<GameDto[]>();

            return result;
        }
    }
}
