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

            var newReview = await _reviewService.AddReview(request, userId);
            if (newReview == null)
            {
                return BadRequest(new {
                    success = false,
                    message = "Review failed",
                    timestamp = DateTime.UtcNow
                });
            }
            return Ok(newReview);
        }

        [HttpDelete("delete/{reviewId}")]
        public async Task<IActionResult> DeleteReview([FromRoute] Guid reviewId)
        {
            var ok = await _reviewService.DeleteReview(reviewId);
            if (!ok)
            {
                return BadRequest(new {
                    success = false,
                    message = "Delete failed",
                    timestamp = DateTime.UtcNow
                });
            }
            return Ok(new { success = true, message = "Review deleted successfully" });
        }

        [HttpPut("update/{reviewId}")]
        public async Task<IActionResult> UpdateReview([FromRoute] Guid reviewId, UpdateReviewRequest request)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var reviewDto = await _reviewService.UpdateReview(reviewId, request, userId);
            if (reviewDto == null)
            {
                return BadRequest(new {
                    success = false,
                    message = "Update failed",
                    timestamp = DateTime.UtcNow
                });
            }
            return Ok(reviewDto);
        }

        [HttpPost("reaction/{reviewId}/{isLike}")]
        public async Task<IActionResult> AddReaction([FromRoute] Guid reviewId, [FromRoute] bool isLike)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var ReactionResponse = await _reviewService.AddReaction(reviewId, userId, isLike);
            return Ok(ReactionResponse);
        }
    }
}
