using Microsoft.EntityFrameworkCore;
using Vidb_Games.Data;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Models.Entities;
using Vidb_Games.Services.Interfaces;
using System.Net.Http;

namespace Vidb_Games.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public ReviewService(AppDbContext context, IConfiguration configuration)
        {
            _configuration = configuration;
            _context = context;
        }

        public async Task<bool> AddReview(ReviewRequest request, Guid userId)
        {
            try
            {
                var review = new Review
                {
                    GameId = request.GameId,
                    UserId = userId,
                    Rating = request.Rating,
                    Comment = request.Comment,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Reviews.Add(review);

                await _context.SaveChangesAsync();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR:");
                Console.WriteLine(ex.ToString());

                return false;
            }
        }

        public async Task<ICollection<ReviewDto>> GetReviews(long gameId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.GameId == gameId)
                .Select(r => new ReviewDto
                {
                    UserId = r.UserId,
                    Rating = r.Rating,
                    Comment = r.Comment,
                    Likes = r.Likes,
                    Dislikes = r.Dislikes,
                    ProfilePictureUrl = r.User.ProfilePictureUrl,
                    Username = r.User.Username,
                    Reputation = r.User.Reputation
                })
                .ToListAsync();

            if (reviews.Count == 0)
            {
                return Array.Empty<ReviewDto>();
            }

            return reviews;
        }
    }
}
