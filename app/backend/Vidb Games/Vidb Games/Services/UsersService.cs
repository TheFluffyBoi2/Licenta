using Vidb_Games.Data;
using Vidb_Games.Services.Interfaces;
using Vidb_Games.Models.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections;
using Vidb_Games.Models.Entities;
using System.Text.Json;


namespace Vidb_Games.Services
{
    public class UsersService : IUsersService
    {
        private readonly AppDbContext _context;

        public UsersService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role,
                    ProfilePictureUrl = u.ProfilePictureUrl
                })
                .ToListAsync();
        }

        public async Task<UserDto?> GetUserByIdAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                Role = user.Role,
                ProfilePictureUrl = user.ProfilePictureUrl,
                Bio = user.Bio,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<UserDto?> UpdateUserAsync(Guid id, UpdateUserDto userDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return null;

            if (!string.IsNullOrEmpty(userDto.Username)) user.Username = userDto.Username;

            if (!string.IsNullOrEmpty(userDto.Email) && userDto.Email != user.Email)
            {
                if (await _context.Users.AnyAsync(u => u.Email == userDto.Email && u.Id != id))
                {
                    throw new InvalidOperationException("Email is already in use.");
                }
                user.Email = userDto.Email;
            }

            if (userDto.Bio != null) user.Bio = userDto.Bio;
            if (!string.IsNullOrEmpty(userDto.ProfilePictureUrl)) user.ProfilePictureUrl = userDto.ProfilePictureUrl;

            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                Role = user.Role,
                ProfilePictureUrl = user.ProfilePictureUrl,
                Bio = user.Bio,
                CreatedAt = user.CreatedAt
            };
        }

        public async Task<bool> DeleteUserAsync(Guid id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<GameDto[]?> GetUserGames(Guid userId)
        {
            var gamesIds = await _context.UserGameEntries.Where(ug => ug.UserId == userId).Select(ug => ug.GameId).ToListAsync();
            if (gamesIds.Count == 0)
            {
                return Array.Empty<GameDto>();
            }

            var gamesJson = await _context.Games.Where(g => gamesIds.Contains(g.Id)).Select(g => g.RawJsonData).ToListAsync();
            var games = gamesJson.Select(json => JsonSerializer.Deserialize<GameDto>(json)).Where(g => g != null).ToArray()!;

            return games;
        }

        public async Task<ICollection<ReviewDto>?> GetReviews(Guid userId)
        {
            var reviews = await _context.Reviews.Where(r => r.UserId == userId).Select(r =>
                new ReviewDto
                {
                    Id = r.Id,
                    UserId = r.UserId,
                    GameId = r.GameId,
                    Rating = r.Rating
                }
            ).ToListAsync();
            if (reviews.Count == 0)
            {
                return Array.Empty<ReviewDto>();
            }

            return reviews;
        }

        public async Task<ICollection<UGEntryDto>?> GetUserGameEntries(Guid userId)
        {
            var relations = await _context.UserGameEntries.Where(ug => ug.UserId == userId).Select(ug =>
                new UGEntryDto
                {
                    UserId = ug.UserId,
                    GameId = ug.GameId,
                    Status = ug.Status
                }
            ).ToListAsync();

            if (relations.Count == 0)
            {
                return Array.Empty<UGEntryDto>();
            }

            return relations;
        }

        public async Task<User[]?> SearchUsers(string query, int limit = 15)
        {
            if (string.IsNullOrEmpty(query))
            {
                return Array.Empty<User>();
            }

            var trimmed = query.Trim();
            if (trimmed.Length < 2)
            {
                return Array.Empty<User>();
            }

            var safe = trimmed.Replace("\\", "\\\\").Replace("\"", "\\\"");
            limit = Math.Clamp(limit, 1, 50);

            User[] users = _context.Users.Where(u => u.Username.Contains(safe)).Take(limit).ToArray()!;

            if (users.Count() == 0)
            {
                return Array.Empty<User>();
            }

            return users;
        }

        public async Task<UserStatsDto> GetUserStats(Guid userId)
        {
            int gamesCount = await _context.UserGameEntries.Where(ug => ug.UserId == userId).CountAsync();
            float meanScore = await _context.Reviews.Where(r => r.UserId == userId).AverageAsync(r => (float?)r.Rating) ?? 0.0f;
            int completed = await _context.UserGameEntries.Where(ug => ug.UserId == userId && ug.Status == GameStatus.Completed).CountAsync();
            int reviewsCount = await _context.Reviews.Where(r => r.UserId == userId).CountAsync();

            return new UserStatsDto
            {
                TotalGames = gamesCount,
                MeanScore = meanScore,
                Completed = completed,
                TotalReviews = reviewsCount
            };
        }

        public async Task<Dictionary<string, int>> GetUserGenres(Guid userId)
        {
            var userGames = await _context.UserGameEntries.Where(ug => ug.UserId == userId).Select(ug => ug.GameId).ToListAsync();
            if (userGames.Count == 0)
            {
                return new Dictionary<string, int>();
            }

            var userGenres = await _context.Games
                .AsNoTracking()
                .Where(g => userGames.Contains(g.Id))
                .SelectMany(g => g.Genres)
                .Where(genre => genre.Name != null)
                .GroupBy(genre => genre.Name!)
                .ToDictionaryAsync(
                    group => group.Key,
                    group => group.Count()
                );

            return userGenres;
        }

        public async Task<Dictionary<string, int>> GetUserThemes(Guid userId)
        {
            var userGames = await _context.UserGameEntries.Where(ug => ug.UserId == userId).Select(ug => ug.GameId).ToListAsync();
            if (userGames.Count == 0)
            {
                return new Dictionary<string, int>();
            }

            var userThemes = await _context.Games
                .AsNoTracking()
                .Where(g => userGames.Contains(g.Id))
                .SelectMany(g => g.Themes)
                .Where(theme => theme.Name != null)
                .GroupBy(theme => theme.Name!)
                .ToDictionaryAsync(
                    group => group.Key,
                    group => group.Count()
                );

            return userThemes;
        }
    }
}
