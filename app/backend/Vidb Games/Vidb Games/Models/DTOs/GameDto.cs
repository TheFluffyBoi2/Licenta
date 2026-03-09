using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class GameDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("description")]
        public string? Description { get; set; } = string.Empty;
        [JsonPropertyName("background_image")]
        public string? BackgroundImage { get; set; } = string.Empty;
        [JsonPropertyName("metacritic")]
        public int? MetacriticScore { get; set; }
        [JsonPropertyName("ratings_count")]
        public int RatingCounts { get; set; }
        [JsonPropertyName("tags")]
        public ICollection<TagsDto> Tags { get; set; } = new List<TagsDto>();
    }
}
