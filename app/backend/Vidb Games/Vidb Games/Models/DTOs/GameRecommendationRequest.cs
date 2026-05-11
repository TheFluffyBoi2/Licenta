using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class GameRecommendationRequest
    {
        [JsonPropertyName("game_id")]
        public long GameId { get; set; }
    }

}

