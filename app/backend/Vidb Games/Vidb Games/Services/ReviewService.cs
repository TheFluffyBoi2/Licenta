using Microsoft.EntityFrameworkCore;
using Vidb_Games.Data;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Models.Entities;
using Vidb_Games.Services.Interfaces;
using System.Net.Http;
using System.Text.Json;

namespace Vidb_Games.Services
{
    public class ReviewService : IReviewService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IIGDBService _igdbService;


        public ReviewService(AppDbContext context, IConfiguration configuration, IIGDBService igdbService)
        {
            _configuration = configuration;
            _context = context;
            _igdbService = igdbService;
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
                    CreatedAt = DateTime.UtcNow,
                    ModifiedAt = DateTime.UtcNow
                };

                _context.Reviews.Add(review);

                var game = await _context.Games.FindAsync(request.GameId);
                if (game == null)
                {
                    string queryParams =
                        "fields name, slug, summary, storyline, cover.url, first_release_date, " +
                        "aggregated_rating, aggregated_rating_count,  " +
                        "genres.name, platforms.name, game_modes.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher; " +
                        $"where id = {request.GameId}; " +
                        "limit 1;";

                    var result = await _igdbService.SendRequestAsync(queryParams);
                    if (result == null || result.Length == 0)
                    {
                        return null;
                    }
                    var gameResult = result[0];
                    _context.Games.Add(new Game
                    {
                        Id = request.GameId,
                        Name = gameResult.Name,
                        Slug = gameResult.Slug,
                        FirstReleaseDate = gameResult.ReleaseDate.HasValue
                            ? DateTimeOffset.FromUnixTimeSeconds(gameResult.ReleaseDate.Value).UtcDateTime
                            : null,
                        IGDBRating = gameResult.IGDBRating,
                        Cover = gameResult.Cover,
                        Genres = gameResult.Genres,
                        Platforms = gameResult.Platforms,
                        Themes = gameResult.Themes,
                        RawJsonData = JsonSerializer.Serialize(gameResult),
                        CachedAt = DateTime.UtcNow,
                        UserTotalRating = request.Rating,
                        ReviewCount = 1
                    });
                } else
                {
                    game.UserTotalRating += request.Rating;
                    game.ReviewCount += 1;
                }

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
                    Reputation = user.Reputation,
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
            var review = await _context.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
            if (review == null) return false;

            _context.Reviews.Remove(review);

            var game = await _context.Games.FindAsync(review.GameId);
            if (game == null)
            {
                string queryParams =
                    "fields name, slug, summary, storyline, cover.url, first_release_date, " +
                    "aggregated_rating, aggregated_rating_count,  " +
                    "genres.name, platforms.name, game_modes.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher; " +
                    $"where id = {review.GameId}; " +
                    "limit 1;";

                var result = await _igdbService.SendRequestAsync(queryParams);
                if (result == null || result.Length == 0)
                {
                    return false;
                }
                var gameResult = result[0];
                _context.Games.Add(new Game
                {
                    Id = review.GameId,
                    Name = gameResult.Name,
                    Slug = gameResult.Slug,
                    FirstReleaseDate = gameResult.ReleaseDate.HasValue
                        ? DateTimeOffset.FromUnixTimeSeconds(gameResult.ReleaseDate.Value).UtcDateTime
                        : null,
                    IGDBRating = gameResult.IGDBRating,
                    Cover = gameResult.Cover,
                    Genres = gameResult.Genres,
                    Platforms = gameResult.Platforms,
                    Themes = gameResult.Themes,
                    RawJsonData = JsonSerializer.Serialize(gameResult),
                    CachedAt = DateTime.UtcNow,
                });
            } else
            {
                game.UserTotalRating -= review.Rating;
                game.ReviewCount -= 1;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<ReviewDto?> UpdateReview(Guid reviewId, UpdateReviewRequest request, Guid userId)
        {
            var review = await _context.Reviews.FindAsync(reviewId);
            if (review == null) return null;
            var game = await _context.Games.FindAsync(review.GameId);

            if (game == null)
            {
                string queryParams =
                    "fields name, slug, summary, storyline, cover.url, first_release_date, " +
                    "aggregated_rating, aggregated_rating_count,  " +
                    "genres.name, platforms.name, game_modes.name, involved_companies.company.name, involved_companies.developer, involved_companies.publisher; " +
                    $"where id = {review.GameId}; " +
                    "limit 1;";

                var result = await _igdbService.SendRequestAsync(queryParams);
                if (result == null || result.Length == 0)
                {
                    return null;
                }
                var gameResult = result[0];
                _context.Games.Add(new Game {
                    Id = review.GameId,
                    Name = gameResult.Name,
                    Slug = gameResult.Slug,
                    FirstReleaseDate = gameResult.ReleaseDate.HasValue
                        ? DateTimeOffset.FromUnixTimeSeconds(gameResult.ReleaseDate.Value).UtcDateTime
                        : null,
                    IGDBRating = gameResult.IGDBRating,
                    Cover = gameResult.Cover,
                    Genres = gameResult.Genres,
                    Platforms = gameResult.Platforms,
                    Themes = gameResult.Themes,
                    RawJsonData = JsonSerializer.Serialize(gameResult),
                    CachedAt = DateTime.UtcNow,
                });
            }
            else
            {
                game.UserTotalRating -= review.Rating;
                game.UserTotalRating += request.Rating;
            }

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
            var reviewVote = await _context.ReviewVotes.FirstOrDefaultAsync(rv => rv.ReviewId == reviewId && rv.UserId == userId);
            var review = await _context.Reviews.Include(r => r.User).FirstOrDefaultAsync(rv => rv.Id == reviewId);
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
                        review.User.Reputation += 20;
                    } else
                    {
                        review.Likes -= 1;
                        review.Dislikes += 1;
                        review.User.Reputation -= 20;
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
                    review.User.Reputation += 10;
                } else
                {
                    review.Dislikes += 1;
                    review.User.Reputation -= 10;
                }
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
