using System.ComponentModel.DataAnnotations;

namespace Vidb_Games.Models.Entities
{
    public enum GameStatus
    {
        Wishlist = 0,
        CurrentlyPlaying,
        Completed,
        Dropped,
    }
    public class UserGameEntry
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        public Guid UserId { get; set; }

        [Required]
        public long GameId { get; set; }

        [Required]
        public GameStatus Status { get; set; }

        public DateTime FirstTimeAdded { get; set; }
        public DateTime LastTimeModified { get; set; }
    }
}
