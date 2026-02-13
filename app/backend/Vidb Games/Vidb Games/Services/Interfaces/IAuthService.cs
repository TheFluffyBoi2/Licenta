using Vidb_Games.Models.DTOs;

namespace Vidb_Games.Services.Interfaces
{
    public interface IAuthService
    {
        Task<VerificationDto?> RegisterAsync(RegisterDto registerDto);

        Task<AuthDto?> LoginAsync(LoginDto loginDto);

        Task<AuthDto?> GoogleLoginAsync(string idToken);

        Task<ResetPasswordDto?> ResetPasswordAsync(string email);

        Task<bool> CancelRegistrationAsync(string email);

        Task<bool> VerifyEmailAsync(string token);
    }
}
