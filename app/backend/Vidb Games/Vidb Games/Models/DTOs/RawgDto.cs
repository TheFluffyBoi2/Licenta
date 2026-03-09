using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public record RawgDto(
        [property: JsonPropertyName("count")] int Count, 
        [property: JsonPropertyName("results")] List<GameDto> Results
        );
}
