namespace Vidb_Games.Models.DTOs
{
    public record VerificationDto
    (
        string Email,
        string Username,
        string JwtToken,
        string VerificationToken
    );
}
