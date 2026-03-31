using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Vidb_Games.Data;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Services;
using Vidb_Games.Services.Interfaces;

namespace Vidb_Games.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IAuthService _authService;
        private readonly IUsersService _usersService;
        private readonly EmailService _emailService;

        public AuthController(IAuthService authService, IUsersService usersService, EmailService emailService, AppDbContext context)
        {
            _authService = authService;
            _usersService = usersService;
            _emailService = emailService;
            _context = context;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleLogin(GoogleLoginDto dto)
        {
            try
            {
                var result = await _authService.GoogleLoginAsync(dto.idToken);
                if (result == null)
                {
                    return Unauthorized("Invalid token.");
                }
                return Ok(result);
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto registerDto)
        {
            try
            {
                var result = await _authService.RegisterAsync(registerDto);

                if (result == null) return BadRequest("Registration failed.");

                await _emailService.SendVerificationEmailAsync(result.Email, result.VerificationToken);

                return Ok(new { Message = "Registration successful. Please check your email to verify your account." });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        [HttpPost("cancel")]
        public async Task<IActionResult> CancelRegister(CancelRegisterDto dto)
        {
            var success = await _authService.CancelRegistrationAsync(dto.Email);
            if (!success)
            {
                return NotFound(new { Message = "User not found or already verified." });
            }

            return Ok(new { Message = "Registration cancelled and user removed." });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto loginDto)
        {
            var result = await _authService.LoginAsync(loginDto);
            if (result == null)
            {
                return Unauthorized("Invalid email or password.");
            }
            return Ok(result);
        }

        [HttpPost("reset")]
        public async Task<IActionResult> ResetPassword(ResetRequestDto dto) 
        {
            try
            {
                var result = await _authService.ResetPasswordAsync(dto.Email);
                if (result == null)
                {
                    return BadRequest("Failed to initiate password reset. Please check the email and try again.");
                }
                await _emailService.SendPasswordResetEmailAsync(dto.Email, result.ResetToken);
                return Ok(new { Message = "Password reset email sent successfully." });
            }
            catch (Exception e)
            {
                return BadRequest(new { message = e.Message });
            }
        }

        // TREBUIE SA FIE POST
        [HttpGet("confirm-reset")]
        public async Task<IActionResult> ConfirmReset([FromQuery] string token)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.PasswordResetToken == token);

            if (user == null)
            {
                return BadRequest("Token invalid sau expirat.");
            }

            string tempPassword = Guid.NewGuid().ToString().Substring(0, 8);

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(tempPassword);

            user.PasswordResetToken = null;

            await _context.SaveChangesAsync();

            return Ok(new { NewPassword = tempPassword });
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string token)
        {
            var success = await _authService.VerifyEmailAsync(token);

            if (!success)
            {
                return BadRequest("Invalid or expired token");
            }

            return Ok(new {Message = "Email verified successfully. You can now log in."});
        }

        [HttpGet("myprofile")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userIdString = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();

            var userDto = await _usersService.GetUserByIdAsync(userId);
            if (userDto == null) return NotFound();

            return Ok(new
            {
                UserId = userDto.Id,
                Username = userDto.Username,
                Email = userDto.Email,
                Role = userDto.Role,
                ProfilePictureUrl = userDto.ProfilePictureUrl
            });
        }
    }
}
