using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class RelationshipsDto
    {
        [JsonPropertyName("wishlists")]
        public int Wishlists { get; set; }
        [JsonPropertyName("playing")]
        public int Playing { get; set; }
        [JsonPropertyName("completed")]
        public int Completed { get; set; }
        [JsonPropertyName("dropped")]
        public int Dropped { get; set; }
    }

}

