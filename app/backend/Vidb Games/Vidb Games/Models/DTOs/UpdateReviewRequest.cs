using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class UpdateReviewRequest
    {
        [JsonPropertyName("rating")]
        [Required(ErrorMessage = "Rating is required")]
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5")]
        public int Rating { get; set; }

        [JsonPropertyName("comment")]
        [Required(ErrorMessage = "Comment is required")]
        [MinLength(3, ErrorMessage = "Comment must be at least 3 characters")]
        [MaxLength(2000, ErrorMessage = "Comment cannot exceed 2000 characters")]
        public string Comment { get; set; } = string.Empty;
    }
}
