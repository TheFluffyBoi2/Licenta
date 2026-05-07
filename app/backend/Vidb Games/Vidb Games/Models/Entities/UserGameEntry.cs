using System.ComponentModel.DataAnnotations;

namespace Vidb_Games.Models.Entities
{
    public enum GameStatus
    {
        Wishlist,
        PlanToPlay,
        CurrentlyPlaying,
        Completed,
    }
    public class UserGameEntry
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }
        public User? User { get; set; }

        [Required]
        public long GameId { get; set; }
        public Game? Game { get; set; }

        [Required]
        public GameStatus Status { get; set; }
    }
}
