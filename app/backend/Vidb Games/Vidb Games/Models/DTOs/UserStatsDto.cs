using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class UserStatsDto
    {
        [JsonPropertyName("total_games")]
        public int TotalGames { get; set; }
        [JsonPropertyName("mean_score")]
        public double MeanScore { get; set; }
        [JsonPropertyName("completed")]
        public int Completed { get; set; }
        [JsonPropertyName("total_reviews")]
        public int TotalReviews { get; set; }
    }

}

