import React, { useState, useEffect } from "react";
import { Star, Plus, Check, Clock, Play } from "lucide-react";
import api from "../api/axios";

const HomePage = () => {
  const [gameStatuses, setGameStatuses] = useState({});
  const [homeFeed, setHomeFeed] = useState({
    recommendations: [],
    topAllTime: [],
    topUpcoming: [],
    topRecent: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await api.get("api/home/feed");
        const data = response.data;

        setHomeFeed({
          recommendations: data.recommendations || data.Recommendations || [],
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

    fetchGames();
  }, []);

  const handleStatusChange = (gameId, status) => {
    setGameStatuses((prev) => ({
      ...prev,
      [gameId]: status,
    }));
  };

  const recommendations = Array.isArray(homeFeed.recommendations)
    ? homeFeed.recommendations
    : [];
  const topAllTime = Array.isArray(homeFeed.topAllTime)
    ? homeFeed.topAllTime
    : [];
  const topUpcoming = Array.isArray(homeFeed.topUpcoming)
    ? homeFeed.topUpcoming
    : [];
  const topRecent = Array.isArray(homeFeed.topRecent) ? homeFeed.topRecent : [];

  const StatusButton = ({ gameId }) => {
    const status = gameStatuses[gameId];

    return (
      <div className="relative group">
        <button className="p-2 bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-lg transition-all">
          {status === "planToPlay" ? (
            <Clock className="w-5 h-5 text-blue-400" />
          ) : status === "playing" ? (
            <Play className="w-5 h-5 text-green-400" />
          ) : status === "finished" ? (
            <Check className="w-5 h-5 text-yellow-400" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>

        <div className="absolute right-0 top-full mt-2 w-48 bg-[#2a2a2a] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
          <button
            onClick={() => handleStatusChange(gameId, "planToPlay")}
            className="w-full px-4 py-2 text-left hover:bg-[#3a3a3a] rounded-t-lg flex items-center gap-2"
          >
            <Clock className="w-4 h-4 text-blue-400" />
            Plan to Play
          </button>
          <button
            onClick={() => handleStatusChange(gameId, "playing")}
            className="w-full px-4 py-2 text-left hover:bg-[#3a3a3a] flex items-center gap-2"
          >
            <Play className="w-4 h-4 text-green-400" />
            Playing Now
          </button>
          <button
            onClick={() => handleStatusChange(gameId, "finished")}
            className="w-full px-4 py-2 text-left hover:bg-[#3a3a3a] rounded-b-lg flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-yellow-400" />
            Finished
          </button>
        </div>
      </div>
    );
  };

  function LargeRank({ rank }) {
    const isFirst = rank == 1;
    const isSecond = rank == 2;
    const isThird = rank == 3;

    if (isFirst)
      return (
        <div className="bg-[#EFBF04] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
    else if (isSecond)
      return (
        <div className="bg-[#A7A7AD] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
    else if (isThird)
      return (
        <div className="bg-[#A77044] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
    else
      return (
        <div className="bg-[#4DFFBC] text-white px-4 py-2 rounded-lg font-bold text-2xl">
          #{rank}
        </div>
      );
  }

  const LargeGameCard = ({ game, rank }) => (
    <div className="relative bg-[#1a1a1a] rounded-xl overflow-hidden hover:ring-2 hover:ring-[#FFD700] transition-all group">
      <div className="absolute top-4 left-4 z-10">
        <LargeRank rank={rank} />
      </div>

      <div className="absolute top-4 right-4 z-10">
        <StatusButton gameId={game.id} />
      </div>

      <div className="relative h-60">
        <img
          src={game.cover.url}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-transparent to-transparent" />
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-2xl font-bold mb-1">{game.name}</h3>
            <div className="flex items-center gap-3 text-gray-400 text-sm">
              <span>{game.first_release_date}</span>
              <span>•</span>
              {game.platforms.map((platform) => (
                <span key={platform}>{platform.name}</span>
              ))}
              {/* <span>{game.platforms}</span> */}
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#2a2a2a] px-3 py-2 rounded-lg">
            <Star className="w-5 h-5 fill-[#FFD700] text-[#FFD700]" />
            <span className="text-xl font-bold">{game.aggregated_rating}</span>
          </div>
        </div>

        <div className="flex gap-2 mb-3">
          {game.genres.map((genre) => (
            <span
              key={genre}
              className="px-3 py-1 bg-[#2a2a2a] rounded-full text-sm"
            >
              {genre.name}
            </span>
          ))}
        </div>

        <p className="text-gray-400 text-sm line-clamp-2">{game.summary}</p>
      </div>
    </div>
  );

  const SmallGameCard = ({ game, rank, isUpcoming = false }) => (
    <div className="relative bg-[#1a1a1a] rounded-lg overflow-hidden hover:ring-2 hover:ring-[#FFD700] transition-all group">
      <div className="absolute top-2 left-2 z-10">
        <div className="bg-[#343434] text-white px-3 py-1 rounded-md font-bold">
          #{rank}
        </div>
      </div>

      <div className="absolute top-2 right-2 z-10">
        <StatusButton gameId={game.id} />
      </div>

      <div className="relative h-48">
        <img
          src={game.cover.url}
          alt={game.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#1a1a1a] via-transparent to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-bold mb-2 line-clamp-1">{game.name}</h3>

        <div className="flex items-center justify-between">
          {isUpcoming ? (
            <span className="text-sm text-gray-400">
              {game.first_release_date}
            </span>
          ) : (
            <span className="text-sm text-gray-400">
              {game.first_release_date}
            </span>
          )}

          {game.aggregated_rating && (
            <div className="flex items-center gap-1 text-sm">
              <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
              <span className="font-semibold">{game.aggregated_rating}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pb-12 flex flex-col gap-3 max-w-400 mx-auto">
      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-8 py-4 shadow-lg transition-all duration-500 ease-in-out">
        Recommended for You
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Recommended for You</h2>
          <div className="h-1 grow bg-linear-to-r from-[#FFD700] to-transparent rounded" />
        </div>
        <section>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {recommendations.map((game, idx) => (
              <SmallGameCard key={game.id} game={game} rank={idx + 1} />
            ))}
          </div>
        </section>
      </div>

      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 shadow-lg transition-all duration-500 ease-in-out">
        {/* Top 10 All Time */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Top 10 All Time</h2>
          <div className="h-1 grow bg-linear-to-r from-[#FFD700] to-transparent rounded" />
        </div>
        <section>
          {/* Top 3 Large Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {topAllTime.slice(0, 3).map((game, idx) => (
              <LargeGameCard key={game.id} game={game} rank={idx + 1} />
            ))}
          </div>

          {/* Remaining 7 Small Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {topAllTime.slice(3, 10).map((game, idx) => (
              <SmallGameCard key={game.id} game={game} rank={idx + 4} />
            ))}
          </div>
        </section>
      </div>

      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 shadow-lg transition-all duration-500 ease-in-out">
        {/* Top 10 Upcoming */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Top 10 Most Anticipated</h2>
          <div className="h-1 grow bg-linear-to-r from-[#FFD700] to-transparent rounded" />
        </div>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {topUpcoming.slice(0, 3).map((game, idx) => (
              <LargeGameCard key={game.id} game={game} rank={idx + 1} />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {topUpcoming.slice(3, 10).map((game, idx) => (
              <SmallGameCard
                key={game.id}
                game={game}
                rank={idx + 4}
                isUpcoming={true}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl text-black dark:text-white px-6 py-4 shadow-lg transition-all duration-500 ease-in-out">
        {/* Top 10 New Releases */}
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-3xl font-bold">Top 10 New Releases</h2>
          <div className="h-1 grow bg-linear-to-r from-[#FFD700] to-transparent rounded" />
        </div>
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {topRecent.slice(0, 3).map((game, idx) => (
              <LargeGameCard key={game.id} game={game} rank={idx + 1} />
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {topRecent.slice(3, 10).map((game, idx) => (
              <SmallGameCard key={game.id} game={game} rank={idx + 4} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
