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

        public GameController(IGameService gameService)
        {
            _gameService = gameService;
        }

        [HttpGet("game_data/{gameId}")]
        public async Task<IActionResult> GetGameData([FromRoute] long gameId)
        {
            var gameDataTask = _gameService.GetGameData(gameId);
            var recommendationsTask = _gameService.GetGameRecommendations(gameId);

            await Task.WhenAll(gameDataTask, recommendationsTask);

            return Ok(new GameInfoResponse
            {
                GameInfo = await gameDataTask,
                gameDtos = await recommendationsTask
            });
        }
    }
}
