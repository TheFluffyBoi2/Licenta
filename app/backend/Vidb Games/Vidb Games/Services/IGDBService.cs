using IGDB;
using IGDB.Models;
using System.Text.Json;
using Vidb_Games.Data;
using Vidb_Games.Models.DTOs;
using Vidb_Games.Models.Entities;
using Vidb_Games.Services.Interfaces;

namespace Vidb_Games.Services
{

    public class IGDBService : IIGDBService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly IGDBClient _IGDBClient;

        private static readonly HashSet<string> StoreTypes = new(StringComparer.OrdinalIgnoreCase)
        {
            "Steam", "Epic Games", "GOG", "PlayStation", "Xbox",
            "Nintendo", "App Store", "Google Play"
        };

        public IGDBService(AppDbContext context, IConfiguration configuration, IGDBClient IGDBClient)
        {
            _context = context;
            _configuration = configuration;
            _IGDBClient = IGDBClient;
        }

        public async Task<GameDto[]> SendRequestAsync(string queryParams)
        {
            var games = await _IGDBClient.QueryAsync<GameDto>(IGDBClient.Endpoints.Games, query: queryParams);

            if (games != null)
            {
                foreach (var game in games)
                {
                    if (game.Cover?.Url != null)
                    {
                        game.Cover.Url = "https:" + game.Cover.Url.Replace("t_thumb", "t_720p");
                    }
                }
            }

            return games ?? Array.Empty<GameDto>();
        }

        public async Task<GameDto[]> GetTopGames()
        {
            string queryParams = "fields id, name, slug, summary, cover.url, aggregated_rating, total_rating_count, first_release_date, genres.name, platforms.name; " +
                         "where platforms = (6) & aggregated_rating != null & total_rating_count > 300 & cover != null; " +
                         "sort aggregated_rating desc; " +
                         "limit 10;";

            return await SendRequestAsync(queryParams);
        }

        public async Task<GameDto[]> GetTopUpcoming()
        {
            long currentUnixTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            string queryParams = $"fields id, name, slug, summary, cover.url, first_release_date, genres.name, platforms.name; " +
                         $"where platforms = (6) & (first_release_date > {currentUnixTime} | first_release_date = null) & cover != null; " +
                         $"sort popularity asc; " +
                         $"limit 10;";

            return await SendRequestAsync(queryParams);
        }

        public async Task<GameDto[]> GetTopRecent()
        {
            long currentUnixTime = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

            string queryParams = $"fields id, name, slug, summary, cover.url, aggregated_rating, total_rating_count, first_release_date, genres.name, platforms.name; " +
                         $"where platforms = (6) & first_release_date < {currentUnixTime} & aggregated_rating != null & total_rating_count > 10 & cover != null; " +
                         $"sort first_release_date desc; " +
                         $"limit 10;";

            return await SendRequestAsync(queryParams);
        }

        public async Task<GameDto[]> SearchGames(string query, int limit = 15)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return Array.Empty<GameDto>();
            }

            var trimmed = query.Trim();
            if (trimmed.Length < 2)
            {
                return Array.Empty<GameDto>();
            }

            var safe = trimmed.Replace("\\", "\\\\").Replace("\"", "\\\"");
            limit = Math.Clamp(limit, 1, 50);

            string queryParams =
                $"search \"{safe}\"; " +
                "fields id, name, slug, summary, cover.url, first_release_date, aggregated_rating, genres.name, platforms.name; " +
                $"limit {limit};";

            return await SendRequestAsync(queryParams);
        }

        // public async Task PopulateDatabase()
        // {
        //     int offset = 0;
        //     int batchSize = 500;
        //     int totalGames = 10_000;
        //     int requestNumber =  totalGames / batchSize;
        //     for (int i = 0; i < requestNumber; i++)
        //     {
        //         offset = i * batchSize;
        //         string queryParams = $"""
        //             fields id, name, slug, summary, cover.url,
        //             aggregated_rating, total_rating_count, storyline,
        //             first_release_date, genres.name, themes.name,
        //             platforms.name, game_modes.name,
        //             keywords.name, involved_companies.developer,
        //             involved_companies.publisher,
        //             involved_companies.company.name,
        //             websites.url, websites.type.type;
        //             where aggregated_rating != null & total_rating_count > 10;
        //             sort aggregated_rating desc;
        //             limit 500;
        //             offset {offset};
        //             """;
        //         var games = await SendRequestAsync(queryParams);
        //         foreach (var game in games)
        //         {
        //             var db_game = new Vidb_Games.Models.Entities.Game
        //             {
        //                 Id = game.IgdbId,
        //                 Name = game.Name,
        //                 Slug = game.Slug,
        //                 Description = game.Description,
        //                 Cover = game.Cover?.Url != null
        //                     ? "https:" + game.Cover.Url
        //                     : null,
        //                 IGDBRating = game.IGDBRating,
        //                 Storyline = game.Storyline,
        //                 FirstReleaseDate = game.ReleaseDate.HasValue
        //                     ? DateTimeOffset.FromUnixTimeSeconds(game.ReleaseDate.Value).UtcDateTime
        //                     : null,
        //                 Genres = game.Genres.Select(g => new Vidb_Games.Models.Entities.Genre
        //                 { IgdbId = g.Id, Name = g.Name ?? "" }).ToList(),
        //                 Themes = game.Themes.Select(t => new Vidb_Games.Models.Entities.Theme
        //                 { IgdbId = t.Id, Name = t.Name ?? "" }).ToList(),
        //                 Platforms = game.Platforms.Select(p => new Vidb_Games.Models.Entities.Platform
        //                 { IgdbId = p.Id, Name = p.Name ?? "" }).ToList(),
        //                 Modes = game.Modes.Select(m => new Vidb_Games.Models.Entities.Mode
        //                 { IgdbId = m.Id, Name = m.Name ?? "" }).ToList(),
        //                 Keywords = game.Keywords.Select(k => new Vidb_Games.Models.Entities.Keyword
        //                 { IgdbId = k.Id, Name = k.Name ?? "" }).ToList(),
        //                 InvolvedCompanies = game.InvolvedCompanies.Select(ic => new Vidb_Games.Models.Entities.InvolvedCompany
        //                 {
        //                     IgdbId = ic.Id,
        //                     IsDeveloper = ic.IsDeveloper,
        //                     IsPublisher = ic.IsPublisher,
        //                     Company = new Vidb_Games.Models.Entities.Company
        //                     {
        //                         IgdbId = ic.Company?.Id ?? 0,
        //                         Name = ic.Company?.Name ?? ""
        //                     }
        //                 }).ToList(),

        //                 Stores = game.Websites
        //                 .Where(w => StoreTypes.Contains(w.Type?.TypeName ?? ""))
        //                 .Select(w => new Store
        //                 {
        //                     IgdbId = w.Id,
        //                     Type = w.Type?.TypeName ?? "",
        //                     Url = w.Url ?? ""
        //                 }).ToList(),
        //             };

        //             _context.Games.Add(db_game);
        //         }

        //         await _context.SaveChangesAsync();
        //         await Task.Delay(250);
        //     }
        // }
    }
}
