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

        public UserController(IGDBService IGDBService, IUsersService usersService)
        {
            _IGDBService = IGDBService;
            _usersService = usersService;
        }

        [HttpGet("games")]
        public async Task<IActionResult> GetGames()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var games = await _usersService.GetUserGames(userId);
            var reviews = await _usersService.GetReviews(userId);
            var relations = await _usersService.GetUserGameEntries(userId);

            return Ok(new {
                games = games,
                reviews = reviews,
                relations = relations
            });
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchUsers([FromQuery] string q, [FromQuery] int limit = 15)
        {
            var users = await _usersService.SearchUsers(q ?? "", limit);
            return Ok(users);
        }

        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var stats = await _usersService.GetUserStats(userId);
            var genres = await _usersService.GetUserGenres(userId);
            var themes = await _usersService.GetUserThemes(userId);

            return Ok(new {
                stats = stats,
                genre_distribution = genres,
                theme_distribution = themes
                });
        }
    }
}
