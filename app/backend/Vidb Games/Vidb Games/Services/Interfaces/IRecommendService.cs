using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services.Interfaces
{
    public interface IRecommendService
    {
        Task<GameDto[]?> GetUserRecommendations(Guid userId);
    }
}
