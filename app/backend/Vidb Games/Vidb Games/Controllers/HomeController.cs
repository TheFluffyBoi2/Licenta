using Microsoft.AspNetCore.Mvc;
using Vidb_Games.Services;
using Vidb_Games.Services.Interfaces;

namespace Vidb_Games.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly IRawgService _rawgService;
        private readonly IUsersService _usersService;

        public HomeController(IRawgService rawgService, IUsersService usersService)
        {
            _rawgService = rawgService;
            _usersService = usersService;
        }

        [HttpGet("main-page-games")]
        public async Task<IActionResult> GetMainPageGames()
        {
            try
            {
                var lastYearGames = _rawgService.GetLastYearGames();
                var upcomingGames = _rawgService.GetUpcomingGames();
                var topAllTimes = _rawgService.GetTopAllTimes();

                await Task.WhenAll(lastYearGames, upcomingGames, topAllTimes);

                return Ok(new
                {
                    LastYearGames = lastYearGames,
                    UpcomingGames = upcomingGames,
                    TopAllTimes = topAllTimes
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }
    }
}
