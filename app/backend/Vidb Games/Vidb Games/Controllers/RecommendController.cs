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
    public class RecommendController : ControllerBase
    {
        private readonly IGDBService _IGDBService;
        private readonly IRecommendService _recommendService;

        public RecommendController(IGDBService IGDBService, IRecommendService recommendService)
        {
            _IGDBService = IGDBService;
            _recommendService = recommendService;
        }

        [HttpPost("recommend")]
        public async Task<IActionResult> GetRecommendations(TextRecommendationRequest request)
        {
            var recommendedGames = await _recommendService.GetDescriptionRecommendations(request.Description);
            return Ok(recommendedGames);
        }
    }
}
