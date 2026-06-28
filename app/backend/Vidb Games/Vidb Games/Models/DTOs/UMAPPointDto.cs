using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class UMAPPointDto
    {
        [JsonPropertyName("game_id")]
        public long GameId { get; set; }
        [JsonPropertyName("name")]
        public string Name { get; set;} = string.Empty;
        [JsonPropertyName("x")]
        public float X { get; set; }
        [JsonPropertyName("y")]
        public float Y { get; set; }
        [JsonPropertyName("cluster")]
        public int Cluster { get; set; }

    }
}
