using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services.Interfaces
{
    public interface IReviewService
    {
        Task<bool> AddReview(ReviewRequest request, Guid userId);
        Task<ICollection<ReviewDto>> GetReviews(long gameId);
    }
}
