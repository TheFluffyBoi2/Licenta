using System.ComponentModel.DataAnnotations;

namespace Vidb_Games.Models.Entities
{
    public class Game
    {
        [Key]
        public long Id { get; set; }
        public string? Name { get; set; } = string.Empty;
        public string? Slug { get; set; } = string.Empty;
        public string? Cover { get; set; } = string.Empty;
        public string? Description { get; set; } = string.Empty;
        public string? Storyline { get; set; } = string.Empty;
        public DateTime? FirstReleaseDate { get; set; }
        public double? IGDBRating { get; set; }
        public int ViewCount { get; set; } = 0;
        public DateTime LastViewed { get; set; } = DateTime.UtcNow;

        public ICollection<Review> Reviews { get; set; } = new List<Review>();
        public ICollection<Genre> Genres { get; set; } = new List<Genre>();
        public ICollection<Theme> Themes { get; set; } = new List<Theme>();
        public ICollection<Platform> Platforms { get; set; } = new List<Platform>();
        public ICollection<Mode> Modes { get; set; } = new List<Mode>();
        public ICollection<Keyword> Keywords { get; set; } = new List<Keyword>();
        public ICollection<InvolvedCompany> InvolvedCompanies { get; set; } = new List<InvolvedCompany>();
        public ICollection<Store> Stores { get; set; } = new List<Store>();
    }

    public class Genre
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public long IgdbId { get; set; }
        public string? Name { get; set; } = string.Empty;
        public ICollection<Game> Games { get; set; } = new List<Game>();
    }

    public class Theme
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public long IgdbId { get; set; }
        public string? Name { get; set; } = string.Empty;
        public ICollection<Game> Games { get; set; } = new List<Game>();
    }

    public class Platform
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public long IgdbId { get; set; }
        public string? Name { get; set; } = string.Empty;
        public ICollection<Game> Games { get; set; } = new List<Game>();
    }

    public class Mode
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public long IgdbId { get; set; }
        public string? Name { get; set; } = string.Empty;
        public ICollection<Game> Games { get; set; } = new List<Game>();
    }

    public class Keyword
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public long IgdbId { get; set; }
        public string? Name { get; set; } = string.Empty;
        public ICollection<Game> Games { get; set; } = new List<Game>();
    }

    public class Company
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public long IgdbId { get; set; }
        public string Name { get; set; } = string.Empty;

    }

    public class InvolvedCompany
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public long IgdbId { get; set; }
        public bool IsDeveloper { get; set; }
        public bool IsPublisher { get; set; }

        public Guid GameId { get; set; }
        public Game Game { get; set; } = null!;

        public Guid CompanyId { get; set; }
        public Company Company { get; set; } = null!;
    }

    public class Store
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public long IgdbId { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Url { get; set; } = string.Empty;

        public Guid GameId { get; set; }
        public Game Game { get; set; } = null!;
    }
}
