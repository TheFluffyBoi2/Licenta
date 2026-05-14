using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services.Interfaces
{
    public interface IGameService
    {
        Task<(GameDto?, GameEntryDto?)> GetGameData(long gameId, Guid userId);
        Task<GameDto[]?> GetGameRecommendations(long gameId);
        Task<GameDto[]> SearchGames(string query, int limit = 15);
        Task<bool> ChangeStatus(long gameId, Guid userId, int status);
    }
}
