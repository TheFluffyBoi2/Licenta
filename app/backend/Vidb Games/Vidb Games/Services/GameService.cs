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

        public async Task<(GameDto?, GameEntryDto?)> GetGameData(long gameId, Guid userId)
        {
            string queryParams =
                "fields name, slug, summary, storyline, cover.url, first_release_date, " +
                "aggregated_rating, aggregated_rating_count, rating, rating_count, " +
                "genres.name, platforms.name, game_modes.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher; " +
                $"where id = {gameId}; " +
                "limit 1;";

            var result = await _igdbService.SendRequestAsync(queryParams);

            if (result == null || result.Length == 0)
            {
                return (null, null);
            }

            var relationship = _context.UserGameEntries.Where(ug => ug.GameId == gameId && ug.UserId == userId)
                .Select(ug => new GameEntryDto
                {
                    Status = (int)ug.Status,
                    FirstTimeAdded = ug.FirstTimeAdded,
                    LastTimeModified = ug.LastTimeModified
                }).FirstOrDefault();

            return (result[0] ?? null, relationship ?? null);
        }

        public Task<GameDto[]> SearchGames(string query, int limit = 15)
        {
            return _igdbService.SearchGames(query, limit);
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

        public async Task<bool> ChangeStatus(long gameId, Guid userId, int status)
        {
            var entry = await _context.UserGameEntries.Where(ug => ug.UserId == userId && ug.GameId == gameId).FirstOrDefaultAsync();

            if (entry == null)
            {
                var newEntry = new UserGameEntry
                {
                    GameId = gameId,
                    UserId = userId,
                    Status = (GameStatus)status,
                    FirstTimeAdded = DateTime.UtcNow,
                    LastTimeModified = DateTime.UtcNow
                };

                _context.UserGameEntries.Add(newEntry);
            }
            else
            {
                entry.Status = (GameStatus)status;
                entry.LastTimeModified = DateTime.UtcNow;
            }

            var result = await _context.SaveChangesAsync();

            return result > 0;
        }

    }
}
