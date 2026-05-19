using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class ReactionResponse
    {
        [JsonPropertyName("likes")]
        public int Likes { get; set; }
        [JsonPropertyName("dislikes")]
        public int Dislikes { get; set; }
    }

}

