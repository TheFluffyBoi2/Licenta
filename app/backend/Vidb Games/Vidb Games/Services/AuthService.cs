using Google.Apis.Auth;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Xml.Linq;
using Vidb_Games.Data;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Models.Entities;
using Vidb_Games.Services.Interfaces;

namespace Vidb_Games.Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        private string GenerateJwtToken(User user)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role)
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public async Task<AuthDto?> GoogleLoginAsync(string idToken)
        {
            var clientId = _configuration["GoogleAuthentication:ClientId"];
            if (string.IsNullOrEmpty(clientId))
                return null;

            GoogleJsonWebSignature.Payload payload;
            try
            {
                var validationSettings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { clientId }
                };
                payload = await GoogleJsonWebSignature.ValidateAsync(idToken, validationSettings);
            }
            catch
            {
                return null;
            }

            var email = payload.Email;
            if (string.IsNullOrEmpty(email))
                return null;

            var name = payload.Name;

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
            {
                var sanitizedName = SanitizeUsername(payload.Name);

                if (await _context.Users.AnyAsync(u => u.Username == sanitizedName))
                {
                    sanitizedName += "_" + Guid.NewGuid().ToString().Substring(0, 5);
                }

                user = new User
                {
                    Email = payload.Email,
                    Username = sanitizedName,
                    Role = "User",
                    Provider = "Google",
                    PasswordHash = string.Empty,
                    CreatedAt = DateTime.UtcNow
                };

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            return new AuthDto(user.Email, user.Username, GenerateJwtToken(user));
        }

        public async Task<VerificationDto?> RegisterAsync(RegisterDto registerDto)
        {
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email)) throw new Exception("Email already in use");
            if (await _context.Users.AnyAsync(u => u.Username == SanitizeUsername(registerDto.Username))) throw new Exception("Username already in use");

            var user = new User
            {
                Email = registerDto.Email,
                Username = SanitizeUsername(registerDto.Username),
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Provider = "Local",
                VerificationToken = Guid.NewGuid().ToString(),
                Role = "User",
                EmailVerified = false,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return new VerificationDto(user.Email, user.Username, GenerateJwtToken(user), user.VerificationToken);
        }

        public async Task<AuthDto?> LoginAsync(LoginDto loginDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == loginDto.Email);

            if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return null;
            }
            return new AuthDto(user.Email, user.Username, GenerateJwtToken(user));
        }

        public async Task<ResetPasswordDto?> ResetPasswordAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (user == null) return null;
            user.PasswordResetToken = Guid.NewGuid().ToString();
            await _context.SaveChangesAsync();
            return new ResetPasswordDto(email, user.PasswordResetToken);
        }

        public async Task<bool> CancelRegistrationAsync(string email)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email && !u.EmailVerified);
            if (user == null) return false;
            if (user.Provider != "Local") return false;
            if (user.VerificationToken == null) return false;
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> VerifyEmailAsync(string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.VerificationToken == token);
            if (user == null) return false;
            user.EmailVerified = true;
            user.VerificationToken = null;
            await _context.SaveChangesAsync();
            return true;
        }

        private string SanitizeUsername(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return "user_" + Guid.NewGuid().ToString().Substring(0, 8);

            string username = name.ToLower().Trim();

            username = username.Replace(" ", "_");

            username = System.Text.RegularExpressions.Regex.Replace(username, @"[^a-z0-9_]", "");

            return username;
        }
    }
}
