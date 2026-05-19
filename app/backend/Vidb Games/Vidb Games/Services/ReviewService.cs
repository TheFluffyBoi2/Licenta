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

        public async Task<ReviewDto?> AddReview(ReviewRequest request, Guid userId)
        {
            try
            {
                var user = await _context.Users.FindAsync(userId);
                if (user == null) return null;

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

                var reviewDto = new ReviewDto
                {
                    Id = review.Id,
                    Date = review.CreatedAt,
                    UserId = review.UserId,
                    Rating = review.Rating,
                    Comment = review.Comment,
                    Likes = 0,
                    Dislikes = 0,
                    ProfilePictureUrl = user.ProfilePictureUrl,
                    Username = user.Username,
                    Reputation = user.Reputation
                };

                return reviewDto;
            }
            catch (Exception ex)
            {
                Console.WriteLine("ERROR:");
                Console.WriteLine(ex.ToString());

                return null;
            }
        }

        public async Task<ICollection<ReviewDto>> GetReviews(long gameId)
        {
            var reviews = await _context.Reviews
                .Where(r => r.GameId == gameId)
                .Select(r => new ReviewDto
                {
                    Id = r.Id,
                    Date = r.CreatedAt,
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

        public async Task<bool> DeleteReview(Guid reviewId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null) return false;

            _context.Reviews.Remove(review);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ReviewDto?> UpdateReview(Guid reviewId, UpdateReviewRequest request, Guid userId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null) return null;

            if (request.Comment != null) review.Comment = request.Comment;
            review.Rating = request.Rating;

            await _context.SaveChangesAsync();

            var user = await _context.Users.FindAsync(userId);
            if (user == null) return null;

            var reviewDto = new ReviewDto
            {
                Id = review.Id,
                Date = review.CreatedAt,
                UserId = review.UserId,
                Rating = review.Rating,
                Comment = review.Comment,
                Likes = 0,
                Dislikes = 0,
                ProfilePictureUrl = user.ProfilePictureUrl,
                Username = user.Username,
                Reputation = user.Reputation
            };
            return reviewDto;
        }

        public async Task<ReactionResponse?> AddReaction(Guid reviewId, Guid userId, bool isLike)
        {
            var reviewVote = _context.ReviewVotes.FirstOrDefault(rv => rv.ReviewId == reviewId && rv.UserId == userId);
            var review = _context.Reviews.FirstOrDefault(rv => rv.Id == reviewId);
            if (review == null) return null;

            if (reviewVote != null)
            {
                if (reviewVote.IsLike == isLike)
                {
                    return null;
                }
                else
                {
                    reviewVote.IsLike = isLike;
                    if (isLike)
                    {
                        review.Likes += 1;
                        review.Dislikes -= 1;
                    } else
                    {
                        review.Likes -= 1;
                        review.Dislikes += 1;
                    }
                }
            }
            else
            {
                var newReviewVote = new ReviewVote
                {
                    ReviewId = reviewId,
                    UserId = userId,
                    IsLike = isLike
                };
                _context.ReviewVotes.Add(newReviewVote);
                if (isLike)
                {
                    review.Likes += 1;
                } else
                {
                    review.Dislikes += 1;
                }
                _context.ReviewVotes.Add(newReviewVote);
            }

            await _context.SaveChangesAsync();
            return new ReactionResponse
            {
                Likes = review.Likes,
                Dislikes = review.Dislikes
            };
        }
    }
}
