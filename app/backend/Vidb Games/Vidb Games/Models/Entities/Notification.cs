using System.ComponentModel.DataAnnotations;
using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Models.Entities
{
    public class Notification
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public long GameId { get; set; }
        public string GameName { get; set; } = string.Empty;
        public string StoreName { get; set; } = string.Empty;

        public decimal SalePrice { get; set; }
        public decimal NormalPrice { get; set; }
        public int SavingsPercent { get; set; }
        public string DealUrl { get; set; } = string.Empty;
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public User User { get; set; }
        public Game Game { get; set; }

    }
}
