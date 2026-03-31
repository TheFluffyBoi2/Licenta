using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class GameDto
    {
        [JsonPropertyName("id")]
        public int IgdbId { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
        [JsonPropertyName("slug")]
        public string Slug { get; set; } = string.Empty;
        [JsonPropertyName("summary")]
        public string? Description { get; set; } = string.Empty;
        [JsonPropertyName("cover")]
        public CoverDto? Cover { get; set; }
        [JsonPropertyName("aggregated_rating")]
        public double? IGDBRating { get; set; }
        [JsonPropertyName("total_rating_count")]
        public int RatingCounts { get; set; }
        [JsonPropertyName("storyline")]
        public string? Storyline { get; set; } = string.Empty;
        [JsonPropertyName("first_release_date")]
        public long? ReleaseDate { get; set; }
        [JsonPropertyName("genres")]
        public ICollection<NamedGamePropertyDto> Genres { get; set; } = new List<NamedGamePropertyDto>();
        [JsonPropertyName("themes")]
        public ICollection<NamedGamePropertyDto> Themes { get; set; } = new List<NamedGamePropertyDto>();
        [JsonPropertyName("platforms")]
        public ICollection<NamedGamePropertyDto> Platforms { get; set; } = new List<NamedGamePropertyDto>();
        [JsonPropertyName("game_modes")]
        public ICollection<NamedGamePropertyDto> Modes { get; set; } = new List<NamedGamePropertyDto>();
        [JsonPropertyName("keywords")]
        public ICollection<NamedGamePropertyDto> Keywords { get; set; } = new List<NamedGamePropertyDto>();
        [JsonPropertyName("involved_companies")]
        public ICollection<InvolvedCompanyDto> InvolvedCompanies { get; set; } = new List<InvolvedCompanyDto>();
        [JsonPropertyName("websites")]
        public ICollection<WebsiteDto> Websites { get; set; } = new List<WebsiteDto>();
    }
}
