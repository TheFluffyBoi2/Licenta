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
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost("add")]
        public async Task<IActionResult> AddReview(ReviewRequest request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var ok = await _reviewService.AddReview(request, userId);
            if (!ok)
            {
                return BadRequest(new {
                    success = false,
                    message = "Review failed",
                    timestamp = DateTime.UtcNow
                });
            }
            return Ok(new { success = true, message = "Review added successfully" });

        }
    }
}
