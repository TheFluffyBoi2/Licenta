using Microsoft.EntityFrameworkCore;
using Vidb_Games.Models.Entities;

namespace Vidb_Games.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        }
}
