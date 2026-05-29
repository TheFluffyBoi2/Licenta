using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class GameInfoResponse
    {
        [JsonPropertyName("game_info")]
        public GameDto? GameInfo { get; set; }
        [JsonPropertyName("game_recommendations")]
        public GameDto[]? gameDtos { get; set; }
        [JsonPropertyName("user_relation")]
        public GameEntryDto? userRelationDto { get; set; }
        [JsonPropertyName("reviews")]
        public ICollection<ReviewDto>? Reviews { get; set; }
        [JsonPropertyName("user_rating")]
        public int Rating { get; set; }
        [JsonPropertyName("rating_count")]
        public int RatingCount { get; set; }
        [JsonPropertyName("total_rating")]
        public int TotalRating { get; set; }
        [JsonPropertyName("recommendation_score")]
        public double? RecommendationScore { get; set; }
        [JsonPropertyName("explanation")]
        public ExplanationDto? Explanation { get; set;}
        [JsonPropertyName("user_explanation")]
        public ICollection<ExplanationUserDto>? ExplanationUser { get; set; }
        [JsonPropertyName("stats")]
        public RelationshipsDto? Stats { get; set; }
    }

}

