using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class ReviewDto
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }
        [JsonPropertyName("game_id")]
        public long GameId { get; set; }
        [JsonPropertyName("user_id")]
        public Guid UserId { get; set; }
        [JsonPropertyName("rating")]
        public int Rating { get; set; }
        [JsonPropertyName("comment")]
        public string? Comment { get; set; }
        [JsonPropertyName("likes")]
        public int Likes { get; set; }
        [JsonPropertyName("dislikes")]
        public int Dislikes { get; set; }
        [JsonPropertyName("profile_picture_url")]
        public string? ProfilePictureUrl { get; set; }
        [JsonPropertyName("username")]
        public string Username { get; set; }
        [JsonPropertyName("reputation")]
        public int Reputation { get; set; }
        [JsonPropertyName("date")]
        public DateTime Date { get; set; }
    }
}
