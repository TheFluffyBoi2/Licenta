using Vidb_Games.Models.DTOs;
using Vidb_Games.Models.Entities;

namespace Vidb_Games.Services.Interfaces
{
    public interface IUsersService
    {
        Task<IEnumerable<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(Guid id);
        Task<UserDto?> UpdateUserAsync(Guid id, UpdateUserDto dto);
        Task<bool> DeleteUserAsync(Guid id);
        Task<GameDto[]?> GetUserGames(Guid userId);
        Task<ICollection<ReviewDto>?> GetReviews(Guid userId);
        Task<ICollection<UGEntryDto>?> GetUserGameEntries(Guid userId);
        Task<User[]?> SearchUsers(string query, int limit = 15);
        Task<UserStatsDto> GetUserStats(Guid userId);
        Task<Dictionary<string, int>> GetUserGenres(Guid userId);
        Task<Dictionary<string, int>> GetUserThemes(Guid userId);
    }
}

