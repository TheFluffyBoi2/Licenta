using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class GameEntryDto
    {
        [JsonPropertyName("status")]
        public int Status { get; set; }
        [JsonPropertyName("first_added")]
        public DateTime FirstTimeAdded { get; set; }
        [JsonPropertyName("last_time_modified")]
        public DateTime LastTimeModified { get; set; }
    }
}
