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
        public DbSet<Review> Reviews { get; set; }
        public DbSet<UserGameEntry> UserGameEntries { get; set; }
        public DbSet<ReviewVote> ReviewVotes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Game>().OwnsOne(g => g.Cover, c => c.ToJson());
            modelBuilder.Entity<Game>().OwnsMany(g => g.Genres, gen => gen.ToJson());
            modelBuilder.Entity<Game>().OwnsMany(g => g.Themes, t => t.ToJson());
            modelBuilder.Entity<Game>().OwnsMany(g => g.Platforms, p => p.ToJson());
        }
    }
}
