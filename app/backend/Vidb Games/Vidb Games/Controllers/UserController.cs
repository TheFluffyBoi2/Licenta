using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Services;
using Vidb_Games.Services.Interfaces;

namespace Vidb_Games.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly IGDBService _IGDBService;
        private readonly IUsersService _usersService;
        private readonly IRecommendService _recommendService;
        private readonly IWebHostEnvironment _env;

        public UserController(IGDBService IGDBService, IUsersService usersService,
            IRecommendService recommendService, IWebHostEnvironment env)
        {
            _IGDBService = IGDBService;
            _usersService = usersService;
            _recommendService = recommendService;
            _env = env;
        }

        // ── Own games list ────────────────────────────────────────────────────

        [HttpGet("games")]
        public async Task<IActionResult> GetGames()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var games     = await _usersService.GetUserGames(userId);
            var reviews   = await _usersService.GetReviews(userId);
            var relations = await _usersService.GetUserGameEntries(userId);

            return Ok(new { games, reviews, relations });
        }

        // ── Public: another user's games list ────────────────────────────────

        [HttpGet("{userId:guid}/games")]
        public async Task<IActionResult> GetUserGamesById(Guid userId)
        {
            var userDto = await _usersService.GetUserByIdAsync(userId);
            if (userDto == null) return NotFound(new { message = "User not found." });

            var games     = await _usersService.GetUserGames(userId);
            var reviews   = await _usersService.GetReviews(userId);
            var relations = await _usersService.GetUserGameEntries(userId);

            return Ok(new
            {
                profile = new
                {
                    userId    = userDto.Id,
                    username  = userDto.Username,
                    profilePictureUrl = userDto.ProfilePictureUrl,
                    bio       = userDto.Bio,
                    createdAt = userDto.CreatedAt
                },
                games,
                reviews,
                relations
            });
        }

        // ── Search ────────────────────────────────────────────────────────────

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string q, [FromQuery] int limit = 15)
        {
            var users = await _usersService.SearchUsers(q ?? "", limit);
            return Ok(users);
        }

        // ── Own profile stats ─────────────────────────────────────────────────

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var stats  = await _usersService.GetUserStats(userId);
            var genres = await _usersService.GetUserGenres(userId);
            var themes = await _usersService.GetUserThemes(userId);
            var points = await _recommendService.GetUMAPPoints(userId);

            return Ok(new
            {
                stats,
                genre_distribution = genres,
                theme_distribution = themes,
                umap_points        = points,
            });
        }

        // ── Avatar upload ─────────────────────────────────────────────────────

        [HttpPost("upload_avatar")]
        public async Task<IActionResult> UploadAvatar([FromForm] IFormFile file)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            if (file == null || file.Length == 0)
                return BadRequest(new { message = "No file provided." });

            // Allow only common image types
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (!allowed.Contains(ext))
                return BadRequest(new { message = "Invalid file type." });

            // Max 5 MB
            if (file.Length > 5 * 1024 * 1024)
                return BadRequest(new { message = "File too large. Max 5 MB." });

            var avatarsDir = Path.Combine(_env.WebRootPath, "uploads");
            Directory.CreateDirectory(avatarsDir);

            var fileName   = $"{userId}{ext}";
            var filePath   = Path.Combine(avatarsDir, fileName);

            await using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
            }

            var relativePath = $"uploads/{fileName}";

            var updated = await _usersService.UpdateUserAsync(userId, new UpdateUserDto
            {
                ProfilePictureUrl = relativePath
            });

            if (updated == null) return NotFound();

            return Ok(new { profilePictureUrl = relativePath });
        }

        // ── Username update ───────────────────────────────────────────────────

        [HttpPut("update_username")]
        public async Task<IActionResult> UpdateUsername([FromBody] UpdateUsernameDto dto)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            if (string.IsNullOrWhiteSpace(dto.Username))
                return BadRequest(new { message = "Username cannot be empty." });

            var trimmed = dto.Username.Trim();
            if (trimmed.Length < 3)
                return BadRequest(new { message = "Username must be at least 3 characters." });

            if (trimmed.Length > 25)
                return BadRequest(new { message = "Username cannot exceed 25 characters." });

            try
            {
                var updated = await _usersService.UpdateUserAsync(userId, new UpdateUserDto
                {
                    Username = trimmed
                });

                if (updated == null) return NotFound();

                return Ok(new { username = updated.Username });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }
    }

    // ── Inline DTO (keep near controller for simplicity) ─────────────────────
    public class UpdateUsernameDto
    {
        public string Username { get; set; } = string.Empty;
    }
}
