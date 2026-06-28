using System.Text.Json.Serialization;

namespace Vidb_Games.Models.DTOs
{
    public class CheapSharkDealDto
    {
        [JsonPropertyName("title")]
        public string Title { get; set; } = string.Empty;

        [JsonPropertyName("storeID")]
        public string StoreId { get; set; } = string.Empty;

        [JsonPropertyName("salePrice")]
        public string SalePrice { get; set; } = string.Empty;

        [JsonPropertyName("normalPrice")]
        public string NormalPrice { get; set; } = string.Empty;

        [JsonPropertyName("savings")]
        public string Savings { get; set; } = string.Empty;

        [JsonPropertyName("dealID")]
        public string DealId { get; set; } = string.Empty;

        [JsonPropertyName("steamAppID")]
        public string? SteamAppId { get; set; }

        [JsonPropertyName("metacriticLink")]
        public string? MetacriticLink { get; set; }
    }

    public class CheapSharkStoreDto
    {
        [JsonPropertyName("storeID")]
        public string StoreId { get; set; } = string.Empty;

        [JsonPropertyName("storeName")]
        public string StoreName { get; set; } = string.Empty;
    }
}
