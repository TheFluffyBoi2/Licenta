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
    public class HomeController : ControllerBase
    {
        private readonly IGDBService _IGDBService;
        private readonly IRecommendService _recommendService;

        public HomeController(IGDBService IGDBService, IRecommendService recommendService)
        {
            _IGDBService = IGDBService;
            _recommendService = recommendService;
        }

        [HttpGet("feed")]
        public async Task<IActionResult> GetHomeFeed()
        {
            try
            {
                var allTimeTasks = _IGDBService.GetTopGames();
                var upcomingTasks = _IGDBService.GetTopUpcoming();
                var recentTasks = _IGDBService.GetTopRecent();

                await Task.WhenAll(allTimeTasks, upcomingTasks, recentTasks);

                return Ok(new
                {
                TopAllTime = await allTimeTasks,
                TopUpcoming = await upcomingTasks,
                TopRecent = await recentTasks
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpGet("feed/recommendations")]
        public async Task<IActionResult> GetHomeRecommendations()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var recommendations = await _recommendService.GetUserRecommendations(userId);

            return Ok(new {recommendations = recommendations ?? Array.Empty<GameDto>()});
        }


        // [HttpPost("populate-database")]
        // [Authorize(Roles="Admin")]
        // public async Task<IActionResult> PopulateDatabase()
        // {
        //     await Task.Run(async () => await _IGDBService.PopulateDatabase());
        //     return Ok("Database population started.");
        // }
    }
}
