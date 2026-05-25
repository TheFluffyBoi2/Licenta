using System.ComponentModel.DataAnnotations;
using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Models.Entities
{
    public class Game
    {
        [Key]
        public long Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string? Slug { get; set; } = string.Empty;
        public CoverDto? Cover { get; set; }
        public DateTime? FirstReleaseDate { get; set; }
        public double? IGDBRating { get; set; }
        public int UserTotalRating { get; set;} = 0;
        public int ReviewCount { get; set;} = 0;
        public int ViewCount { get; set; } = 0;
        public DateTime LastViewed { get; set; } = DateTime.UtcNow;
        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<NamedGamePropertyDto> Genres { get; set; } = new List<NamedGamePropertyDto>();
        public ICollection<NamedGamePropertyDto> Themes { get; set; } = new List<NamedGamePropertyDto>();
        public ICollection<NamedGamePropertyDto> Platforms { get; set; } = new List<NamedGamePropertyDto>();
        public string RawJsonData { get; set; } = string.Empty;
        public DateTime CachedAt { get; set; } = DateTime.UtcNow;
    }
}
