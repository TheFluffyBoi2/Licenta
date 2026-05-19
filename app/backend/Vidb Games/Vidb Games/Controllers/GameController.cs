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
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;
        private readonly IReviewService _reviewService;

        public GameController(IGameService gameService, IReviewService reviewService)
        {
            _gameService = gameService;
            _reviewService = reviewService;
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

            var (gameInfo, userRelation) = await _gameService.GetGameData(gameId, userId);
            var reviews = await _reviewService.GetReviews(gameId);
            var recommendationsTask = _gameService.GetGameRecommendations(gameId);

            if (gameInfo == null || string.IsNullOrWhiteSpace(gameInfo.Name))
            {
                return NotFound(new { message = "Game not found." });
            }

            return Ok(new GameInfoResponse
            {
                GameInfo = gameInfo,
                gameDtos = await recommendationsTask,
                userRelationDto = userRelation,
                Reviews = reviews
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
