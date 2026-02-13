using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using MimeKit.Text;
using System.Runtime.CompilerServices;

namespace Vidb_Games.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public async Task SendPasswordResetEmailAsync(string email, string token)
        {
            var baseUrl = _configuration["App:BaseUrl"];

            var resetUrl = $"{baseUrl}/reset-password?token={token}";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Vidb Games", _configuration["Email:From"]!));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "Reset Your Password - Vidb Games";

            message.Body = new TextPart(TextFormat.Html)
            {
                Text = $@"
                <div style='font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;'>
                    <h2 style='color: #333;'>Password Reset Request</h2>
                    <p>We received a request to reset your password. Click the button below to proceed:</p>
                    <a href='{resetUrl}' style='display: inline-block; background-color: #FFD700; color: #000; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;'>Reset My Password</a>
                    <p style='margin-top: 20px; font-size: 0.8em; color: #777;'>If you didn't request a password reset, please ignore this email.</p>
                </div>"
            };

            using var client = new SmtpClient();
            try
            {
                await client.ConnectAsync(
                    _configuration["Email:SmtpServer"],
                    int.Parse(_configuration["Email:Port"]!),
                    SecureSocketOptions.StartTls
                );

                await client.AuthenticateAsync(
                    _configuration["Email:Username"]!,
                    _configuration["Email:Password"]!
                );

                await client.SendAsync(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to connect to SMTP server: {ex.Message}");
                return;
            }
            finally
            {
                await client.DisconnectAsync(true);
            }
        }

        public async Task SendVerificationEmailAsync(string email, string token)
        {
            var baseUrl = _configuration["App:BaseUrl"];

            var verifyUrl = $"{baseUrl}/verify-email?token={token}";

            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Vidb Games", _configuration["Email:From"]!));
            message.To.Add(new MailboxAddress("", email));
            message.Subject = "Verify Your Email - Vidb Games";

            message.Body = new TextPart(TextFormat.Html)
            {
                Text = $@"
                <div style='font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;'>
                    <h2 style='color: #333;'>Welcome to the club!</h2>
                    <p>Click the button below to verify your email and start your journey:</p>
                    <a href='{verifyUrl}' style='display: inline-block; background-color: #FFD700; color: #000; padding: 12px 25px; text-decoration: none; border-radius: 8px; font-weight: bold;'>Verify My Account</a>
                    <p style='margin-top: 20px; font-size: 0.8em; color: #777;'>If you didn't create an account, please ignore this email.</p>
                </div>"
            };

            using var client = new SmtpClient();
            try
            {
                await client.ConnectAsync(
                    _configuration["Email:SmtpServer"],
                    int.Parse(_configuration["Email:Port"]!),
                    SecureSocketOptions.StartTls
                );

                await client.AuthenticateAsync(
                    _configuration["Email:Username"]!,
                    _configuration["Email:Password"]!
                );

                await client.SendAsync(message);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Failed to connect to SMTP server: {ex.Message}");
                return;
            }
            finally
            {
                await client.DisconnectAsync(true);
            }
        }
    }
}
