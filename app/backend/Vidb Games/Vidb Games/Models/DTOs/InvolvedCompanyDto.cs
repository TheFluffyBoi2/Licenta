using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class InvolvedCompanyDto
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }
        [JsonPropertyName("developer")]
        public bool IsDeveloper { get; set; }
        [JsonPropertyName("publisher")]
        public bool IsPublisher { get; set; }
        [JsonPropertyName("company")]
        public NamedGamePropertyDto Company { get; set; } = new NamedGamePropertyDto();
    }
}
