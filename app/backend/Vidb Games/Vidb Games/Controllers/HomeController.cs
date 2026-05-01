using Microsoft.AspNetCore.Mvc;
using Vidb_Games.Services;
using Vidb_Games.Services.Interfaces;

namespace Vidb_Games.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HomeController : ControllerBase
    {
        private readonly IGDBService _IGDBService;
        private readonly IUsersService _usersService;

        public HomeController(IGDBService IGDBService, IUsersService usersService)
        {
            _IGDBService = IGDBService;
            _usersService = usersService;
        }

        [HttpGet("feed")]
        public async Task<IActionResult> GetHomeFeed()
        {
            try
            {
                var allTimeTasks = _IGDBService.GetTopGames();
                var upcomingTasks = _IGDBService.GetTopUpcoming();
                var recentTasks = _IGDBService.GetTopRecent();

                await Task.WhenAll(allTimeTasks, upcomingTasks, recentTasks);

                return Ok(new
                {
                TopAllTime = await allTimeTasks,
                TopUpcoming = await upcomingTasks,
                TopRecent = await recentTasks
                });
            }
            catch (Exception e)
            {
                return StatusCode(500, $"Internal server error: {e.Message}");
            }
        }

        //[HttpGet("main-page-games")]
        //public async Task<IActionResult> GetMainPageGames()
        //{
        //    try
        //    {
        //        var lastYearGames = _rawgService.GetLastYearGames();
        //        var upcomingGames = _rawgService.GetUpcomingGames();
        //        var topAllTimes = _rawgService.GetTopAllTimes();

        //        await Task.WhenAll(lastYearGames, upcomingGames, topAllTimes);

        //        return Ok(new
        //        {
        //            LastYearGames = lastYearGames,
        //            UpcomingGames = upcomingGames,
        //            TopAllTimes = topAllTimes
        //        });
        //    }
        //    catch (Exception e)
        //    {
        //        return StatusCode(500, $"Internal server error: {e.Message}");
        //    }
        //}

        [HttpPost("populate-database")]
        public async Task<IActionResult> PopulateDatabase()
        {
            await Task.Run(async () => await _IGDBService.PopulateDatabase());
            return Ok("Database population started.");
        }
    }
}
