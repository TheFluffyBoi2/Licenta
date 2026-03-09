using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class TagsDto
    {
        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }
}
