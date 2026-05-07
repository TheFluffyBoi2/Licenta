using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services.Interfaces
{
    public interface IIGDBService
    {
        Task<GameDto[]> SendRequestAsync(string queryParams);
        Task<GameDto[]> GetTopGames();
        Task<GameDto[]> GetTopUpcoming();
        Task<GameDto[]> GetTopRecent();
        Task PopulateDatabase();
    }
}
