using System.ComponentModel.DataAnnotations;

namespace Vidb_Games.Models.Entities
{
    public class Game
    {
        [Key]
        public int Id { get; set; }

        public int MetacriticScore { get; set; }

        public string Slug { get; set; } = string.Empty;

        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public string ReleaseDate { get; set; } = string.Empty;

        public string BackgroundImage { get; set; } = string.Empty;

        public int ViewCount { get; set; } = 0;

        public DateTime LastViewed { get; set; } = DateTime.UtcNow;

        public ICollection<Review> Reviews { get; set; } = new List<Review>();

        public ICollection<string> Tags { get; set; } = new List<string>();

    }
}
