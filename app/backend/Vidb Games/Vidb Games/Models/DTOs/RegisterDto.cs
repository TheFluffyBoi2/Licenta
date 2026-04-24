using System.ComponentModel.DataAnnotations;

namespace Vidb_Games.Models.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage="You must enter an email")]
        [EmailAddress(ErrorMessage="Invalid email format")]
        public string Email { get; set; }

        [Required(ErrorMessage="You must enter an username")]
        [MinLength(3, ErrorMessage="The username must have a min of 3 characters")]
        [RegularExpression(@"^[a-zA-Z0-9]*$", ErrorMessage = "Username can only contain letters and numbers")]
        public string Username { get; set; }

        [Required(ErrorMessage="You must enter a password")]
        [MinLength(9, ErrorMessage="The password must have a min of 9 characters")]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{9,}$",
            ErrorMessage = "The password must contain at least a capital letter, a lowercase letter, a number and a special character.")]
        public string Password { get; set; }
    }
}
