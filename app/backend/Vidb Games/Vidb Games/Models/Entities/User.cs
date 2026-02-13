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

        public string Provider { get; set; } = string.Empty;

        public string? VerificationToken { get; set; } = string.Empty;

        public bool EmailVerified { get; set; } = false;

        public string? PasswordResetToken { get; set; } = string.Empty;

        [MaxLength(250)]
        public string Bio { get; set; } = "Hi there! I am using Vidb Games.";

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
