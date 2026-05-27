import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Star, Plus, Check, Clock, Play } from "lucide-react";
import api from "../api/axios";

const HomePage = () => {
  const [gameStatuses, setGameStatuses] = useState({});
  const [homeFeed, setHomeFeed] = useState({
    topAllTime: [],
    topUpcoming: [],
    topRecent: [],
  });
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get("api/home/feed");
        const data = response.data;

        setHomeFeed({
          topAllTime: data.topAllTime || data.TopAllTime || [],
          topUpcoming: data.topUpcoming || data.TopUpcoming || [],
          topRecent: data.topRecent || data.TopRecent || [],
        });
      } catch (error) {
        console.error("Failed to fetch games:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendations = async () => {
      try {
        const response = await api.get("api/home/feed/recommendations");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data?.recommendations ||
            response.data?.Recommendations ||
            [];

        setRecommendations(data);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    const loadData = async () => {
      await fetchGames();
      await fetchRecommendations();
    };

    loadData();
  }, []);

  const handleStatusChange = (gameId, status) => {
    setGameStatuses((prev) => ({
      ...prev,
      [gameId]: status,
    }));
  };

  const topAllTime = Array.isArray(homeFeed.topAllTime)
    ? homeFeed.topAllTime
    : [];
  const topUpcoming = Array.isArray(homeFeed.topUpcoming)
    ? homeFeed.topUpcoming
    : [];
  const topRecent = Array.isArray(homeFeed.topRecent) ? homeFeed.topRecent : [];

  function LargeRank({ rank }) {
    const isFirst = rank === 1;
    const isSecond = rank === 2;
    const isThird = rank === 3;

    if (isFirst)
      return (
        <div className="bg-[#EFBF04] text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-lg">
          #{rank}
        </div>
      );
    else if (isSecond)
      return (
        <div className="bg-[#A7A7AD] text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-lg">
          #{rank}
        </div>
      );
    else if (isThird)
      return (
        <div className="bg-[#A77044] text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-lg">
          #{rank}
        </div>
      );
    else
      return (
        <div className="bg-[#4DFFBC] text-white px-4 py-2 rounded-lg font-bold text-2xl shadow-lg">
          #{rank}
        </div>
      );
  }

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

  const SmallGameCard = ({
    game,
    rank,
    isUpcoming = false,
    recommended = false,
  }) => (
    <Link
      to={`/game/${game.id}`}
      state={recommended ? { userRecommendation: game.user_explanation } : null}
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
            className="w-full h-full object-cover "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#1a1a1a] via-transparent to-transparent" />
        </div>

        <div className="p-4">
          <h3 className="font-bold mb-2 line-clamp-1 text-gray-900 dark:text-white">
            {game.name}
          </h3>

          <div className="flex items-center justify-between">
            {game.first_release_date ? (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(game.first_release_date * 1000).toLocaleDateString(
                  "en-UK",
                )}
              </span>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                TBD
              </span>
            )}

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

  const LargeGameCard = ({ game, rank }) => (
    <Link to={`/game/${game.id}`} className="cursor-pointer">
      <div className="relative bg-gray-50 dark:bg-[#1a1a1a] cursor-pointer rounded-xl overflow-hidden hover:ring-2 hover:ring-[#50FCBC] transition-all group">
        <div className="absolute top-4 left-4 z-10">
          <LargeRank rank={rank} />
        </div>

        <div className="relative h-60 group-hover:scale-105 transition-transform duration-300">
          <img
            src={game.cover?.url || "/placeholder.jpg"}
            alt={game.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-[#1a1a1a] via-transparent to-transparent" />
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
                {game.name}
              </h3>
              <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 text-sm">
                {game.first_release_date ? (
                  <span>
                    {new Date(
                      game.first_release_date * 1000,
                    ).toLocaleDateString("en-UK")}
                  </span>
                ) : (
                  "TBD"
                )}
                <span>•</span>
                {game.platforms
                  ? game.platforms
                      .slice(0, 2)
                      .map((platform) => (
                        <span key={platform.id || platform.name}>
                          {platform.name}
                        </span>
                      ))
                  : "TBD"}
              </div>
            </div>

            {game.aggregated_rating != null && (
              <div className="flex items-center gap-2 bg-gray-200 dark:bg-[#2a2a2a] px-3 py-2 rounded-lg">
                <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.round(game.aggregated_rating)}
                </span>
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-3 flex-wrap">
            {game.genres &&
              game.genres.slice(0, 3).map((genre) => (
                <span
                  key={genre.id || genre.name}
                  className="px-3 py-1 bg-gray-200 dark:bg-[#2a2a2a] rounded-full text-sm text-gray-700 dark:text-gray-300"
                >
                  {genre.name}
                </span>
              ))}
          </div>

          {game.summary && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
              {game.summary}
            </p>
          )}
        </div>
      </div>
    </Link>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="pb-12 flex flex-col gap-6 max-w-7xl mx-auto">
      {!loadingRecommendations &&
      recommendations &&
      recommendations.length > 0 ? (
        <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-6 shadow-lg transition-all duration-500 ease-in-out">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-3xl font-bold">Recommended for You</h2>
            <div className="h-1 flex-grow bg-gradient-to-r from-[#50FCBC] to-transparent rounded" />
          </div>
          <section>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {recommendations.slice(0, 6).map((game, idx) => (
                <SmallGameCard
                  key={`recommendation-${game.id}`}
                  game={game}
                  rank={idx + 1}
                  recommended={true}
                />
              ))}
            </div>
          </section>
        </div>
      ) : (
        loadingRecommendations && (
          <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-6 shadow-lg transition-all duration-500 ease-in-out">
            <div className="animate-pulse flex flex-col items-center  grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              Loading Recommendations
            </div>
          </div>
        )
      )}

      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-6 shadow-lg transition-all duration-500 ease-in-out">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Top 10 All Time</h2>
          <div className="h-1 flex-grow bg-gradient-to-r from-[#50FCBC] to-transparent rounded" />
        </div>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {topAllTime.slice(0, 3).map((game, idx) => (
              <LargeGameCard
                key={`top-all-time-${game.id}`}
                game={game}
                rank={idx + 1}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {topAllTime.slice(3, 10).map((game, idx) => (
              <SmallGameCard
                key={`top-all-time-${game.id}`}
                game={game}
                rank={idx + 4}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-6 shadow-lg transition-all duration-500 ease-in-out">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Top 10 Most Anticipated</h2>
          <div className="h-1 flex-grow bg-gradient-to-r from-[#50FCBC] to-transparent rounded" />
        </div>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {topUpcoming.slice(0, 3).map((game, idx) => (
              <LargeGameCard
                key={`top-upcoming-${game.id}`}
                game={game}
                rank={idx + 1}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {topUpcoming.slice(3, 10).map((game, idx) => (
              <SmallGameCard
                key={`top-upcoming-${game.id}`}
                game={game}
                rank={idx + 4}
                isUpcoming={true}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-6 shadow-lg transition-all duration-500 ease-in-out">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Top 10 New Releases</h2>
          <div className="h-1 flex-grow bg-gradient-to-r from-[#50FCBC] to-transparent rounded" />
        </div>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {topRecent.slice(0, 3).map((game, idx) => (
              <LargeGameCard
                key={`top-recent-${game.id}`}
                game={game}
                rank={idx + 1}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {topRecent.slice(3, 10).map((game, idx) => (
              <SmallGameCard
                key={`top-recent-${game.id}`}
                game={game}
                rank={idx + 4}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
