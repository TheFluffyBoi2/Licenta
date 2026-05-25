using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Vidb_Games.Models.Entities;

namespace Vidb_Games.Models.DTOs
{
    public class UGEntryDto
    {
        [JsonPropertyName("user_id")]
        public Guid UserId { get; set; }
        [JsonPropertyName("game_id")]
        public long GameId { get; set; }
        [JsonPropertyName("status")]
        public GameStatus Status { get; set; }
    }
}
