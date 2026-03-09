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

        [Required]
        public int GameId { get; set; }

        public int Likes { get; set; } = 0;

        public int Dislikes { get; set; } = 0;

        public Guid UserId { get; set; }
        
        public User? User { get; set; }
    }
}
