using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class StatusChangeRequest
    {
        [JsonPropertyName("game_id")]
        public long GameId { get; set; }
        [JsonPropertyName("status")]
        public int Status { get; set; }
    }

}

