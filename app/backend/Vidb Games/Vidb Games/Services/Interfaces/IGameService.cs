using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services.Interfaces
{
    public interface IGameService
    {
        Task<GameDto?> GetGameData(long gameId);
        Task<GameDto[]?> GetGameRecommendations(long gameId);
    }
}
