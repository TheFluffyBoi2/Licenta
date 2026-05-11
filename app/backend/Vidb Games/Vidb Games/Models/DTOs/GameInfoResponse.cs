using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class GameInfoResponse
    {
        [JsonPropertyName("game_info")]
        public GameDto? GameInfo { get; set; }
        [JsonPropertyName("game_recommendations")]
        public GameDto[]? gameDtos { get; set; }
    }

}

