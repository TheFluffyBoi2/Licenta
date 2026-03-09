using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services.Interfaces
{
    public interface IRawgService
    {
        Task<RawgDto?> GetLastYearGames();
        Task<RawgDto?> GetUpcomingGames();
        Task<RawgDto?> GetTopAllTimes();
        Task<RawgDto?> GetGamesPage(int page, int pageSize);
    }
}
