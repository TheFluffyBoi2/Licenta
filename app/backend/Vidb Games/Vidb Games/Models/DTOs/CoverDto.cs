using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class CoverDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;
    }
}
