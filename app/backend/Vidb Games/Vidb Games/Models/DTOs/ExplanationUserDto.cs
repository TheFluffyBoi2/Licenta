using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class ExplanationUserDto
    {
        [JsonPropertyName("rec_for_id")]
        [Newtonsoft.Json.JsonProperty("rec_for_id")]
        public long RecommendedForId { get; set; }
        [JsonPropertyName("rec_for_name")]
        [Newtonsoft.Json.JsonProperty("rec_for_name")]
        public string? RecommendedForName { get; set; }
        [JsonPropertyName("score")]
        [Newtonsoft.Json.JsonProperty("score")]
        public float Score { get; set; }
    }
}
