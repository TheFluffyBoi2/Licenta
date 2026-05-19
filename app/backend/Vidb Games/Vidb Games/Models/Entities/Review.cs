using System.ComponentModel.DataAnnotations;

namespace Vidb_Games.Models.Entities
{
    public class Review
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public int Rating { get; set; }

        public string? Comment { get; set; } = string.Empty;

        public long GameId { get; set; }

        public int Likes { get; set; } = 0;

        public int Dislikes { get; set; } = 0;

        [Required]
        public Guid UserId { get; set; }

        public User User { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ModifiedAt { get; set; }

    }
}
