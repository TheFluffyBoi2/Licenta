using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class GenreDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}
