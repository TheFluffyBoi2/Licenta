import React, { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Star, Plus, Check, Clock, Play } from "lucide-react";
import api from "../api/axios";

const RecommendPage = () => {
  const [gameStatuses, setGameStatuses] = useState({});
  const [prompt, setPrompt] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const response = await api.post("api/recommend/recommend", {
        description: prompt,
      });

      const data = response.data.recommendations || response.data;

      setRecommendations(Array.isArray(data) ? data.slice(0, 10) : []);
    } catch (err) {
      console.error("Eroare la obținerea recomandărilor:", err);
      setError(
        "Something went wrong while fetching recommendations. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (gameId, status) => {
    setGameStatuses((prev) => ({
      ...prev,
      [gameId]: status,
    }));
  };

  const StatusButton = ({ gameId }) => {
    const status = gameStatuses[gameId];

    return (
      <div className="relative group">
        <button className="p-2 bg-gray-100 dark:bg-[#1a1a1a] hover:bg-gray-200 dark:hover:bg-[#2a2a2a] rounded-lg transition-all">
          {status === "planToPlay" ? (
            <Clock className="w-5 h-5 text-blue-500 dark:text-blue-400" />
          ) : status === "playing" ? (
            <Play className="w-5 h-5 text-green-500 dark:text-green-400" />
          ) : status === "finished" ? (
            <Check className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
          ) : (
            <Plus className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          )}
        </button>

        <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => handleStatusChange(gameId, "planToPlay")}
            className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-t-lg flex items-center gap-2 transition-colors"
          >
            <Clock className="w-4 h-4 text-blue-500 dark:text-blue-400" />
            Plan to Play
          </button>
          <button
            onClick={() => handleStatusChange(gameId, "playing")}
            className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] flex items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4 text-green-500 dark:text-green-400" />
            Playing Now
          </button>
          <button
            onClick={() => handleStatusChange(gameId, "finished")}
            className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-b-lg flex items-center gap-2 transition-colors"
          >
            <Check className="w-4 h-4 text-yellow-500 dark:text-yellow-400" />
            Finished
          </button>
        </div>
      </div>
    );
  };

  const SmallGameCard = ({ game, rank, isUpcoming = false }) => (
    <Link
      to={`/game/${game.id}`}
      state={{ descriptionExplanation: game.explanation }}
      className="cursor-pointer"
    >
      <div className="relative bg-gray-50 dark:bg-[#1a1a1a] cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-[#50FCBC] transition-all group">
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-gray-300 dark:bg-[#343434] text-gray-900 dark:text-white px-3 py-1 rounded-md font-bold text-sm shadow-md">
            #{rank}
          </div>
        </div>

        <div className="relative h-48 group-hover:scale-105 transition-transform duration-300">
          <img
            src={game.cover?.url || "/placeholder.jpg"}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-50 dark:from-[#1a1a1a] via-transparent to-transparent" />
        </div>

        <div className="p-4">
          <h3 className="font-bold mb-2 line-clamp-1 text-gray-900 dark:text-white">
            {game.name}
          </h3>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {game.first_release_date != null
                ? new Date(game.first_release_date * 1000).toLocaleDateString(
                    "en-UK",
                  )
                : "TBD"}
            </span>

            {game.aggregated_rating != null && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {Math.round(game.aggregated_rating)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-start pt-20 px-6 max-w-7xl mx-auto transition-all duration-500">
      {/* Secțiunea de Căutare Centrală */}
      <div
        className={`w-full max-w-3xl transition-all duration-700 ease-in-out ${hasSearched ? "mb-12" : "mt-20"}`}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-black dark:text-white transition-colors">
            What kind of game do you want to play?
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            Describe the vibe, mechanics, or story you're looking for, and we'll
            find the perfect match.
          </p>
        </div>

        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-[#50FCBC] transition-colors" />
          </div>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A survival game about building a base in space..."
            className="block w-full pl-16 pr-24 py-5 text-lg
                       bg-white dark:bg-[#1C1C1C]
                       text-black dark:text-white
                       placeholder-gray-400 dark:placeholder-gray-500
                       border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700
                       rounded-full shadow-lg hover:shadow-xl
                       focus:outline-none focus:ring-2 focus:ring-[#50FCBC] focus:border-transparent
                       transition-all duration-300"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="absolute inset-y-2 right-2 px-6 bg-[#121212] hover:bg-[#383838] text-white rounded-full
                       font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors
                       flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Discover"
            )}
          </button>
        </form>
      </div>

      {/* Secțiunea de Rezultate */}
      {hasSearched && (
        <div className="w-full animate-in fade-in slide-in-from-bottom-10 duration-700">
          {error && (
            <div className="text-red-500 text-center mb-8 bg-red-500/10 py-4 rounded-xl">
              {error}
            </div>
          )}

          {!loading && !error && recommendations.length > 0 && (
            <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl p-8 shadow-lg transition-colors duration-500">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl font-bold text-black dark:text-white">
                  Your AI Recommendations
                </h2>
                <div className="h-1 grow bg-linear-to-r from-[#50FCBC] to-transparent rounded" />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {recommendations.map((game, idx) => (
                  // Asigură-te că exporți SmallGameCard din HomePage.js sau îl muți într-un fișier separat
                  <SmallGameCard
                    key={`ai-rec-${game.id}`}
                    game={game}
                    rank={idx + 1}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading &&
            !error &&
            hasSearched &&
            recommendations.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-12">
                No games found for that description. Try being a bit broader!
              </div>
            )}
        </div>
      )}
    </div>
  );
};

export default RecommendPage;
