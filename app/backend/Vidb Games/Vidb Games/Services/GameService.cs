using Microsoft.EntityFrameworkCore;
using Vidb_Games.Data;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Models.Entities;
using Vidb_Games.Services.Interfaces;
using System.Net.Http;

namespace Vidb_Games.Services
{
    public class GameService : IGameService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IIGDBService _igdbService;
        private readonly IRecommendService _recommendService;

        public GameService(AppDbContext context, IConfiguration configuration, IIGDBService igdbService, IRecommendService recommendService)
        {
            _configuration = configuration;
            _context = context;
            _igdbService = igdbService;
            _recommendService = recommendService;
        }

        public async Task<GameDto?> GetGameData(long gameId)
        {
            string queryParams = $"fields name, slug, summary, cover.url, first_release_date, genres.name, platforms.name; " +
                                 $"where id = {gameId}; " +
                                 $"limit 1;";

            var result = await _igdbService.SendRequestAsync(queryParams);

            if (result == null || result.Length == 0)
            {
                return null;
            }

            return result[0] ?? null;
        }
        public async Task<GameDto[]?> GetGameRecommendations(long gameId)
        {
            var result = await _recommendService.GetGameRecommendations(gameId);

            if (result == null || result.Length == 0)
            {
                return null;
            }

            return result ?? Array.Empty<GameDto>();
        }
    }
}
