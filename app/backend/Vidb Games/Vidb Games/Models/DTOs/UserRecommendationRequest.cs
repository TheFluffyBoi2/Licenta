using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class UserRecommendationRequest
    {
        [JsonPropertyName("games_tuple")]
        public List<long[]> GamesTuple { get; set; } = new List<long[]>();
    }

}

