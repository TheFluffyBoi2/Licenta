using System.ComponentModel.DataAnnotations;

namespace Vidb_Games.Models.Entities
{
    public class ReviewVote
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid UserId { get; set; }
        public Guid ReviewId { get; set;}
        public bool IsLike { get; set; }
        public User User { get; set; }
        public Review Review { get; set; }
    }
}
