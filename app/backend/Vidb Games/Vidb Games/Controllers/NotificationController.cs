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
[Route("api/notifications")]
[Authorize]
public class NotificationController : ControllerBase
{
    private readonly AppDbContext _db;

    public NotificationController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetNotifications()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();
        var notifs = await _db.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .Select(n => new {
                n.Id,
                n.GameName,
                n.StoreName,
                n.SalePrice,
                n.NormalPrice,
                n.SavingsPercent,
                n.DealUrl,
                n.CreatedAt
            })
            .ToListAsync();

        return Ok(notifs);
    }

    [HttpPatch("{id}/read")]
    public async Task<IActionResult> MarkRead(Guid id)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();
        var n = await _db.Notifications
            .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);
        if (n == null) return NotFound();

        n.IsRead = true;
        await _db.SaveChangesAsync();
        return Ok();
    }

    [HttpPatch("read-all")]
    public async Task<IActionResult> MarkAllRead()
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId)) return Unauthorized();
        await _db.Notifications
            .Where(n => n.UserId == userId && !n.IsRead)
            .ExecuteUpdateAsync(s => s.SetProperty(n => n.IsRead, true));
        return Ok();
    }
}
}
