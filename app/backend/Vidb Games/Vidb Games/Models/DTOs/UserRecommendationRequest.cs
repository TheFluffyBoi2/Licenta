using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class UserRecommendationRequest
    {
        [JsonPropertyName("game_ids")]
        public List<long> GameIds { get; set; } = new List<long>();
    }

}

