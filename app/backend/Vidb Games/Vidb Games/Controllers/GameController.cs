using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Vidb_Games.Data;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Services;
using Vidb_Games.Services.Interfaces;

namespace Vidb_Games.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IReviewService _reviewService;
        private readonly IRecommendService _recommendService;
        private readonly AppDbContext _context;

        public GameController(IGameService gameService, IReviewService reviewService, IRecommendService recommendService,
            AppDbContext context)
        {
            _gameService = gameService;
            _reviewService = reviewService;
            _context = context;
            _recommendService = recommendService;
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchGames([FromQuery] string q, [FromQuery] int limit = 15)
        {
            var games = await _gameService.SearchGames(q ?? "", limit);
            return Ok(games);
        }

        [HttpGet("game_data/{gameId}")]
        public async Task<IActionResult> GetGameData([FromRoute] long gameId)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var (gameInfo, userRelation, stats, totalRating, ratingCount) = await _gameService.GetGameData(gameId, userId);
            var reviews = await _reviewService.GetReviews(gameId);

            if (gameInfo == null || string.IsNullOrWhiteSpace(gameInfo.Name))
            {
                return NotFound(new { message = "Game not found." });
            }

            return Ok(new GameInfoResponse
            {
                GameInfo = gameInfo,
                userRelationDto = userRelation,
                Reviews = reviews,
                Rating = ratingCount > 0 ? totalRating / ratingCount : 0,
                RatingCount = ratingCount,
                TotalRating = totalRating,
                Stats = stats
            });
        }

        [HttpGet("game_data/recommendations/{gameId}")]
        public async Task<IActionResult> GetGameRecommendations([FromRoute] long gameId)
        {
            var recommendations = await _gameService.GetGameRecommendations(gameId);
            return Ok(new
            {
                game_recommendations = recommendations ?? Array.Empty<GameDto>()
            });
        }

        [HttpPost("update_status")]
        public async Task<IActionResult> UpdateStatus(StatusChangeRequest request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var ok = await _gameService.ChangeStatus(request.GameId, userId, request.Status);
            if (!ok)
            {
                return BadRequest(new {
                    success = false,
                    message = "Update failed",
                    timestamp = DateTime.UtcNow
                });
            }
            return Ok(new { success = true, message = "Status updated successfully" });
        }
    }
}
