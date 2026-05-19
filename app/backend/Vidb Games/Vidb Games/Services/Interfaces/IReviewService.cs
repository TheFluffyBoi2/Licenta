using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services.Interfaces
{
    public interface IReviewService
    {
        Task<ReviewDto?> AddReview(ReviewRequest request, Guid userId);
        Task<ICollection<ReviewDto>> GetReviews(long gameId);
        Task<bool> DeleteReview(Guid reviewId);
        Task<ReviewDto?> UpdateReview(Guid reviewId, UpdateReviewRequest request, Guid userId);
        Task<ReactionResponse?> AddReaction(Guid reviewId, Guid userId, bool isLike);
    }
}
