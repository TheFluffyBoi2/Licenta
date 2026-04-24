using System.ComponentModel.DataAnnotations;

namespace Vidb_Games.Models.Entities
{
    public class User
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required, EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required, MaxLength(25)]
        public string Username { get; set; } = string.Empty;

        [Required]
        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "User";

        public string ProfilePictureUrl { get; set; } = "default_avatar.png";

        public int TotalReviews { get; set; } = 0;

        public int Reputation { get; set; } = 0;

        public string Provider { get; set; } = string.Empty;

        public string? VerificationToken { get; set; } = string.Empty;

        public DateTime? VerificationTokenDate { get; set; }

        public bool EmailVerified { get; set; } = false;

        public string? PasswordResetToken { get; set; } = string.Empty;

        public DateTime? PasswordResetTokenDate { get; set; }

        [MaxLength(250)]
        public string Bio { get; set; } = "Hi there! I am using Vidb Games.";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? LockoutEnd { get; set; } = null;

        public int FailedAttempts { get; set; } = 0;

        public ICollection<Review> Reviews { get; set; } = new List<Review>();
    }
}
