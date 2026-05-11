using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class TextRecommendationRequest
    {
        [Required(ErrorMessage="You can't send in an empty request")]
        [JsonPropertyName("description")]
        public string Description { get; set; } = string.Empty;
    }

}

