using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class ReviewRequest
    {
        [JsonPropertyName("game_id")]
        [Required(ErrorMessage = "Game ID is required")]
        [Range(1, long.MaxValue, ErrorMessage = "Game ID must be positive")]
        public long GameId { get; set; }

        [JsonPropertyName("rating")]
        [Required(ErrorMessage = "Rating is required")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [JsonPropertyName("comment")]
        [Required(ErrorMessage = "Comment is required")]
        [MinLength(10, ErrorMessage = "Comment must be at least 10 characters")]
        [MaxLength(2000, ErrorMessage = "Comment cannot exceed 2000 characters")]
        public string Comment { get; set; } = string.Empty;
    }
}
