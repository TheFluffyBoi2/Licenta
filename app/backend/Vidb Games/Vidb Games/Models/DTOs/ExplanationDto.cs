using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class ExplanationDto
    {
        [JsonPropertyName("genres")]
        [Newtonsoft.Json.JsonProperty("genres")]
        public float Genres { get; set; }
        [JsonPropertyName("themes")]
        [Newtonsoft.Json.JsonProperty("themes")]
        public float Themes { get; set; }
        [JsonPropertyName("keywords")]
        [Newtonsoft.Json.JsonProperty("keywords")]
        public float Keywords { get; set; }
        [JsonPropertyName("summary")]
        [Newtonsoft.Json.JsonProperty("summary")]
        public float Summary { get; set; }
    }
}
