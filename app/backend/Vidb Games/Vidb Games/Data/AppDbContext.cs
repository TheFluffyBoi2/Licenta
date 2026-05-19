using Microsoft.EntityFrameworkCore;
using Org.BouncyCastle.Bcpg.OpenPgp;
using Vidb_Games.Models.Entities;

namespace Vidb_Games.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<Platform> Platforms { get; set; }
        public DbSet<Theme> Themes { get; set; }
        public DbSet<Mode> Developers { get; set; }
        public DbSet<Keyword> Keywords { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<InvolvedCompany> InvolvedCompanies { get; set; }
        public DbSet<Store> Stores { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<UserGameEntry> UserGameEntries { get; set; }
        public DbSet<ReviewVote> ReviewVotes { get; set; }


    }
}
