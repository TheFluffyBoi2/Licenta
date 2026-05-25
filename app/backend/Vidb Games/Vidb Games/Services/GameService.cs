using Microsoft.EntityFrameworkCore;
using Vidb_Games.Data;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Models.Entities;
using Vidb_Games.Services.Interfaces;
using System.Net.Http;
using System.Text.Json;


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

        public async Task<(GameDto?, GameEntryDto?, int, int)> GetGameData(long gameId, Guid userId)
        {
            var game = _context.Games.FirstOrDefault(g => g.Id == gameId);

            int totalRating = 0;
            int reviewCount = 0;

            if (game == null)
            {
                string queryParams =
                    "fields name, slug, summary, storyline, cover.url, first_release_date, " +
                    "aggregated_rating, aggregated_rating_count, " +
                    "genres.name, platforms.name, game_modes.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher; " +
                    $"where id = {gameId}; " +
                    "limit 1;";

                var result = await _igdbService.SendRequestAsync(queryParams);
                if (result == null || result.Length == 0)
                {
                    return (null, null, 0, 0);
                }
                var gameResult = result[0];

                game = new Game
                {
                    Id = gameId,
                    Name = gameResult.Name,
                    Slug = gameResult.Slug,
                    FirstReleaseDate = gameResult.ReleaseDate.HasValue
                        ? DateTimeOffset.FromUnixTimeSeconds(gameResult.ReleaseDate.Value).UtcDateTime
                        : null,
                    IGDBRating = gameResult.IGDBRating,
                    Cover = gameResult.Cover,
                    Genres = gameResult.Genres,
                    Platforms = gameResult.Platforms,
                    Themes = gameResult.Themes,
                    RawJsonData = JsonSerializer.Serialize(gameResult),
                    CachedAt = DateTime.UtcNow
                };

                _context.Games.Add(game);
                await _context.SaveChangesAsync();
            } else
            {
                totalRating = game.UserTotalRating;
                reviewCount = game.ReviewCount;
            }

            var relationship = _context.UserGameEntries.Where(ug => ug.GameId == gameId && ug.UserId == userId)
                .Select(ug => new GameEntryDto
                {
                    Status = (int)ug.Status,
                    FirstTimeAdded = ug.FirstTimeAdded,
                    LastTimeModified = ug.LastTimeModified
                }).FirstOrDefault();

            return (JsonSerializer.Deserialize<GameDto>(game.RawJsonData) ?? null, relationship ?? null, totalRating, reviewCount);
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
                if (status == 4)
                    _context.UserGameEntries.Remove(entry);
                else
                {
                    entry.Status = (GameStatus)status;
                    entry.LastTimeModified = DateTime.UtcNow;
                }
            }

            var result = await _context.SaveChangesAsync();

            return result > 0;
        }

    }
}
