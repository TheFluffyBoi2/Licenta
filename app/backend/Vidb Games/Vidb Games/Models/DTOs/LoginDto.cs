using System.ComponentModel.DataAnnotations;

namespace Vidb_Games.Models.DTOs
{
    public class LoginDto
    {
       [Required(ErrorMessage="You must enter an email")]
        public string Email { get; set; }

        [Required(ErrorMessage="You must enter a password")]
        public string Password { get; set; }
    }
}
