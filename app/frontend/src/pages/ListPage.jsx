import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  ArrowUpDown,
  Star,
  Search,
  Trophy,
  Clock,
  X,
} from "lucide-react";
import api from "../api/axios";

const ListPage = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("score");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minScore: 0,
    maxScore: 5,
    genres: [],
    platforms: [],
  });
  const API_URL = "http://localhost:8080";

  useEffect(() => {
    fetchUserGames();
  }, []);

  const fetchUserGames = async () => {
    try {
      setLoading(true);
      const response = await api.get("api/user/games");
      const { games, reviews, relations } = response.data;
      const fullDataGames = (games || []).map((game) => {
        const relation = (relations || []).find((r) => r.game_id === game.id);
        const review = (reviews || []).find((r) => r.game_id === game.id);
        return {
          ...game,
          status: relation ? relation.status : null,
          userScore: review ? review.rating : null,
        };
      });
      setGames(fullDataGames || []);
    } catch (error) {
      console.error("Failed to fetch games:", error);
      setGames([]);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredGames = () => {
    let filtered = [...games];

    if (activeTab !== "all") {
      const statusMap = {
        wishlist: 0,
        playing: 1,
        completed: 2,
        dropped: 3,
      };
      filtered = filtered.filter(
        (game) => game.status === statusMap[activeTab],
      );
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((game) =>
        game.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Filter by score range (remember userScore is 0-5 scale)
    if (filters.minScore > 0 || filters.maxScore < 5) {
      filtered = filtered.filter((game) => {
        const score = game.userScore || 0;
        return score >= filters.minScore && score <= filters.maxScore;
      });
    }

    // Filter by genres
    if (filters.genres.length > 0) {
      filtered = filtered.filter((game) =>
        game.genres?.some((genre) => filters.genres.includes(genre.name)),
      );
    }

    // Filter by platforms
    if (filters.platforms.length > 0) {
      filtered = filtered.filter((game) =>
        game.platforms?.some((platform) =>
          filters.platforms.includes(platform.name),
        ),
      );
    }

    switch (sortBy) {
      case "score":
        filtered.sort((a, b) => (b.userScore || 0) - (a.userScore || 0));
        break;
      case "title":
        filtered.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
        break;
      default:
        break;
    }

    return filtered;
  };

  const tabs = [
    { id: "all", label: "ALL" },
    { id: "wishlist", label: "WISHLIST" },
    { id: "playing", label: "PLAYING" },
    { id: "completed", label: "COMPLETED" },
    { id: "dropped", label: "DROPPED" },
  ];

  const clearFilters = () => {
    setFilters({
      minScore: 0,
      maxScore: 5,
      genres: [],
      platforms: [],
    });
  };

  // Extract unique genres and platforms from games
  const availableGenres = [
    ...new Set(games.flatMap((game) => game.genres?.map((g) => g.name) || [])),
  ].sort();

  const availablePlatforms = [
    ...new Set(
      games.flatMap((game) => game.platforms?.map((p) => p.name) || []),
    ),
  ].sort();

  const toggleGenre = (genre) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const togglePlatform = (platform) => {
    setFilters((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  };

  const GameCard = ({ game, index }) => (
    <div className="relative mt-4">
      <Link
        to={`/game/${game.gameId || game.id}`}
        className={`group block bg-[#1a1a1a] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#50FCBC] transition-all
      ${game.userScore >= 5 ? "border-t-4 border-[#EFBF04]" : game.userScore >= 4 ? "border-t-4 border-[#A7A7AD]" : "border-t-4 border-transparent"}`}
      >
        {game.userScore >= 4 && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
            <div
              className={`${game.userScore >= 5 ? "bg-[#EFBF04]" : "bg-[#A7A7AD]"} text-gray-900 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-md show-md whitespace-nowrap`}
            >
              Top Rated
            </div>
          </div>
        )}

        <div className="absolute top-2 left-2 z-10">
          <div className="text-white bg-[#343434] px-3 py-1 rounded-md font-bold text-sm shadow-lg">
            #{index + 1}
          </div>
        </div>

        <div className="relative h-56 overflow-hidden rounded-t-lg">
          <img
            src={game.cover?.url || "/logo.png"}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />
        </div>

        {/* Game Info */}
        <div className="p-4">
          <h3 className="font-bold text-white mb-2 line-clamp-2 min-h-[3rem]">
            {game.name}
          </h3>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <span className="text-white">
                {game.status == 0
                  ? "Wishlisted"
                  : game.status == 1
                    ? "Playing Now"
                    : game.status == 2
                      ? "Completed"
                      : game.status == 3
                        ? "Dropped"
                        : "Unknown"}{" "}
                |
              </span>
              <span className="text-white">Scored</span>
              <span className="font-bold text-white">
                {Math.round(game.userScore * 20) || "-"}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-400 text-lg">Loading your games...</div>
      </div>
    );
  }

  const filteredGames = getFilteredGames();

  return (
    <div className="min-h-screen bg-[#0a0a0a] rounded-lg">
      {/* Header */}
      <div className="bg-[#1a1a1a] rounded-lg top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-300">
              Viewing Your Game List
            </h1>
          </div>

          {/* Controls Row */}
          <div className="flex flex-wrap font-bold items-center gap-3 mb-4">
            {/* Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 ${showFilters ? "bg-[#50FCBC] text-black" : "bg-[#2a2a2a] text-white"} hover:bg-[#3a3a3a] hover:text-white rounded-lg transition-colors flex items-center gap-2`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(filters.genres.length > 0 ||
                filters.platforms.length > 0 ||
                filters.minScore > 0 ||
                filters.maxScore < 5) && (
                <span className="ml-1 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {filters.genres.length +
                    filters.platforms.length +
                    (filters.minScore > 0 || filters.maxScore < 5 ? 1 : 0)}
                </span>
              )}
            </button>

            <button
              onClick={() =>
                setSortBy((prev) => (prev === "score" ? "title" : "score"))
              }
              className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <ArrowUpDown className="w-4 h-4" />
              Order: {sortBy === "score" ? "Score" : "Title"}
            </button>

            <div className="flex-grow max-w-md ml-auto font-bold">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search games..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] text-white rounded-lg focus:ring-2 focus:ring-[#50FCBC] outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 overflow-x-auto ">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 px-2 text-sm font-bold whitespace-nowrap transition-colors relative ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="border-t border-gray-800 bg-[#0f0f0f]">
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-[#50FCBC] hover:text-[#3dd69f] transition-colors"
                >
                  Clear All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Score Range (0-5 scale for your app) */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Score Range (Your Rating)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={filters.minScore}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minScore: parseInt(e.target.value) || 0,
                        }))
                      }
                      className="w-20 px-3 py-2 bg-[#2a2a2a] text-white rounded-lg focus:ring-2 focus:ring-[#50FCBC] outline-none"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={filters.maxScore}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxScore: parseInt(e.target.value) || 5,
                        }))
                      }
                      className="w-20 px-3 py-2 bg-[#2a2a2a] text-white rounded-lg focus:ring-2 focus:ring-[#50FCBC] outline-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Scale: 0 (worst) to 5 (best)
                  </p>
                </div>

                {/* Genres */}
                {availableGenres.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Genres ({filters.genres.length} selected)
                    </label>
                    <div className="max-h-32 overflow-y-auto bg-[#2a2a2a] rounded-lg p-2">
                      {availableGenres.slice(0, 15).map((genre) => (
                        <label
                          key={genre}
                          className="flex items-center gap-2 py-1 px-2 hover:bg-[#3a3a3a] rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.genres.includes(genre)}
                            onChange={() => toggleGenre(genre)}
                            className="w-4 h-4 accent-[#50FCBC]"
                          />
                          <span className="text-sm text-gray-300">{genre}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Platforms */}
                {availablePlatforms.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Platforms ({filters.platforms.length} selected)
                    </label>
                    <div className="max-h-32 overflow-y-auto bg-[#2a2a2a] rounded-lg p-2">
                      {availablePlatforms.slice(0, 15).map((platform) => (
                        <label
                          key={platform}
                          className="flex items-center gap-2 py-1 px-2 hover:bg-[#3a3a3a] rounded cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={filters.platforms.includes(platform)}
                            onChange={() => togglePlatform(platform)}
                            className="w-4 h-4 accent-[#50FCBC]"
                          />
                          <span className="text-sm text-gray-300">
                            {platform}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Active Filters Display */}
              {(filters.genres.length > 0 ||
                filters.platforms.length > 0 ||
                filters.minScore > 0 ||
                filters.maxScore < 5) && (
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {filters.minScore > 0 || filters.maxScore < 5 ? (
                      <span className="px-3 py-1 bg-[#50FCBC] text-black text-sm rounded-full font-medium flex items-center gap-1">
                        Score: {filters.minScore}-{filters.maxScore}
                        <button
                          onClick={() =>
                            setFilters((prev) => ({
                              ...prev,
                              minScore: 0,
                              maxScore: 5,
                            }))
                          }
                          className="ml-1 hover:bg-black/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : null}
                    {filters.genres.map((genre) => (
                      <span
                        key={genre}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full font-medium flex items-center gap-1"
                      >
                        {genre}
                        <button
                          onClick={() => toggleGenre(genre)}
                          className="ml-1 hover:bg-blue-500/30 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {filters.platforms.map((platform) => (
                      <span
                        key={platform}
                        className="px-3 py-1 bg-purple-500/20 text-purple-400 text-sm rounded-full font-medium flex items-center gap-1"
                      >
                        {platform}
                        <button
                          onClick={() => togglePlatform(platform)}
                          className="ml-1 hover:bg-purple-500/30 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredGames.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-500 text-lg mb-2">
              No games found in this category
            </div>
            <p className="text-gray-600 text-sm">
              {searchQuery
                ? "Try adjusting your search"
                : "Add some games to your list!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredGames.map((game, index) => (
              <GameCard
                key={game.id || game.gameId}
                game={game}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListPage;
