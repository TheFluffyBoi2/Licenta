import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Star,
  Plus,
  Check,
  ArchiveX,
  Clock,
  Gift,
  Play,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Calendar,
  Gamepad2,
  Users,
  Award,
} from "lucide-react";
import api from "../api/axios";

const GamePage = () => {
  const { id } = useParams();
  const [gameInfo, setGameInfo] = useState({});
  const [userRelation, setUserRelation] = useState({});
  const [similarGames, setSimilarGames] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState(null);
  const [reviewSortBy, setReviewSortBy] = useState("likes");
  const [loadError, setLoadError] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [score, setScore] = useState(60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        setLoadError(null);
        setGameInfo({});
        setUserRelation({});
        const numericId = Number(id);
        if (!id || Number.isNaN(numericId) || numericId <= 0) {
          setLoadError("not_found");
          return;
        }

        const response = await api.get(`api/game/game_data/${numericId}`);
        const data = response.data;
        const game_info =
          data.game_info ?? data.gameInfo ?? data.GameInfo ?? null;
        const game_recommendations =
          data.game_recommendations ??
          data.gameRecommendations ??
          data.GameRecommendations ??
          [];
        const user_relation = data.user_relation;

        setGameInfo(game_info || {});
        setSimilarGames(
          Array.isArray(game_recommendations) ? game_recommendations : [],
        );
        setUserRelation(user_relation);
        setGameStatus(user_relation?.status);

        // Mock reviews - replace with actual API call
        setReviews([
          {
            id: 1,
            user: "GamerPro123",
            userKarma: 1250,
            rating: 95,
            content:
              "An absolute masterpiece! The story, gameplay, and visuals all come together perfectly. This is what gaming should be about.",
            likes: 342,
            dislikes: 12,
            date: "2024-03-15",
          },
          {
            id: 2,
            user: "CasualPlayer",
            userKarma: 450,
            rating: 78,
            content:
              "Great game overall, but had some pacing issues in the middle section. Still worth playing for the amazing ending.",
            likes: 128,
            dislikes: 45,
            date: "2024-03-10",
          },
          {
            id: 3,
            user: "HardcoreGamer",
            userKarma: 2890,
            rating: 88,
            content:
              "Challenging and rewarding. The mechanics are deep and satisfying once you master them.",
            likes: 567,
            dislikes: 23,
            date: "2024-03-08",
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch game info:", error);
        if (error.response?.status === 404) {
          setLoadError("not_found");
        } else {
          setLoadError("failed");
        }
        setGameInfo({});
        setSimilarGames([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  const handleStatusChange = async (status) => {
    try {
      setIsChanging(true);
      setGameStatus(status);
      const response = await api.post(`api/game/update_status`, {
        game_id: id,
        status: status,
      });
    } catch (error) {
      console.error("Failed to update game status:", error);
    } finally {
      setIsChanging(false);
    }
  };

  const handleSubmit = async () => {
    if (!reviewText.trim()) {
      alert("Please write a review before submitting.");
      return;
    }

    if (score === 0) {
      alert("Please select a rating before submitting.");
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await api.post(`api/review/add`, {
        game_id: Number(id),
        rating: Math.round(score / 20),
        comment: reviewText,
      });
      setReviewText("");
      setScore(60);
      alert("Review submitted successfully!");
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSortedReviews = () => {
    const sorted = [...reviews];
    switch (reviewSortBy) {
      case "likes":
        return sorted.sort((a, b) => b.likes - a.likes);
      case "dislikes":
        return sorted.sort((a, b) => b.dislikes - a.dislikes);
      case "karma":
        return sorted.sort((a, b) => b.userKarma - a.userKarma);
      default:
        return sorted;
    }
  };

  const StatusButton = () => (
    <div className="relative group">
      <button
        disabled={isChanging}
        className="px-4 py-2 bg-gray-100 dark:hover:bg-[#3a3a3a] hover:bg-gray-50 text-gray-900 dark:text-white dark:bg-black rounded-lg transition-all flex items-center gap-2"
      >
        {isChanging ? (
          <>Saving</>
        ) : gameStatus === 0 ? (
          <>
            <Gift className="w-5 h-5" />
            Wishlist
          </>
        ) : gameStatus === 1 ? (
          <>
            <Play className="w-5 h-5" />
            Playing Now
          </>
        ) : gameStatus === 2 ? (
          <>
            <Check className="w-5 h-5" />
            Completed
          </>
        ) : gameStatus == 3 ? (
          <>
            <ArchiveX className="w-5 h-5" />
            Dropped
          </>
        ) : (
          <>
            <Plus className="w-5 h-5" />
            Add to List
          </>
        )}
      </button>

      <div className="absolute left-0 top-full mt-2 w-48 bg-white dark:bg-[#2a2a2a] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 border border-gray-200 dark:border-gray-700">
        <button
          onClick={() => handleStatusChange(0)}
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-t-lg flex items-center gap-2 transition-colors"
        >
          <Gift className="w-4 h-4 text-blue-500" />
          Wishist
        </button>
        <button
          onClick={() => handleStatusChange(1)}
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] flex items-center gap-2 transition-colors"
        >
          <Play className="w-4 h-4 text-green-500" />
          Playing Now
        </button>
        <button
          onClick={() => handleStatusChange(2)}
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-b-lg flex items-center gap-2 transition-colors"
        >
          <Check className="w-4 h-4 text-yellow-500" />
          Completed
        </button>
        <button
          onClick={() => handleStatusChange(3)}
          className="w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3a3a3a] rounded-b-lg flex items-center gap-2 transition-colors"
        >
          <ArchiveX className="w-4 h-4 text-red-500" />
          Dropped
        </button>
      </div>
    </div>
  );

  const SmallGameCard = ({ game, rank }) => (
    <Link to={`/game/${game.id}`} className="cursor-pointer">
      <div className="relative bg-gray-50 dark:bg-[#1a1a1a] cursor-pointer rounded-lg overflow-hidden hover:ring-2 hover:ring-[#50FCBC] transition-all group">
        <div className="absolute top-2 left-2 z-10">
          <div className="bg-gray-300 dark:bg-[#343434] text-gray-900 dark:text-white px-3 py-1 rounded-md font-bold text-sm shadow-md">
            #{rank}
          </div>
        </div>

        <div className="relative h-48 group-hover:scale-105 transition-transform duration-300">
          <img
            src={game.cover?.url || "/logo.png"}
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

            {game.total_score != null && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-[#FFD700] text-[#FFD700]" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {Math.round(game.total_score)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );

  const ReviewCard = ({ review }) => (
    <div className="bg-gray-50 dark:bg-[#1a1a1a] rounded-lg p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
            {review.user.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-gray-900 dark:text-white">
                {review.user}
              </h4>
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {review.userKarma} karma
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(review.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 px-4 py-2 rounded-lg">
          <Award className="w-5 h-5 text-white" />
          <span className="text-2xl font-bold text-white">{review.rating}</span>
        </div>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {review.content}
      </p>

      <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-500 dark:hover:text-green-400 transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span className="font-semibold">{review.likes}</span>
        </button>
        <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors">
          <ThumbsDown className="w-4 h-4" />
          <span className="font-semibold">{review.dislikes}</span>
        </button>
      </div>
    </div>
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

  if (loadError === "failed") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Could not load this game. Check your connection and try again.
        </p>
        <Link to="/" className="text-[#50FCBC] hover:underline font-medium">
          Back to home
        </Link>
      </div>
    );
  }

  if (loadError === "not_found" || !gameInfo || !gameInfo.name) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <div className="text-gray-500 dark:text-gray-400 text-lg">
          Game not found.
        </div>
        <Link to="/" className="text-[#50FCBC] hover:underline font-medium">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Header Section with Cover and Info */}
      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Cover Image */}
          <div className="flex-shrink-0">
            <img
              src={gameInfo.cover?.url || "/logo.png"}
              alt={gameInfo.name}
              className="w-full md:w-64 h-auto rounded-lg shadow-xl"
            />
            {/* Container dedicat pentru buton, cu aliniere centrată */}
            <div className="mt-4 flex justify-center">
              <StatusButton />
            </div>
          </div>

          {/* Right Side - Game Info */}
          <div className="flex-grow">
            {/* Titlu + Data + Platforme */}
            <div className="mb-4">
              <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {gameInfo.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mb-4 text-gray-600 dark:text-gray-400">
                {gameInfo.first_release_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(
                        gameInfo.first_release_date * 1000,
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
                {gameInfo.platforms && gameInfo.platforms.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Gamepad2 className="w-4 h-4" />
                    <span>
                      {gameInfo.platforms.map((p) => p.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Genres */}
            {gameInfo.genres && gameInfo.genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {gameInfo.genres.map((genre) => (
                  <span
                    key={genre.id || genre.name}
                    className="px-3 py-1 bg-gray-200 dark:bg-[#2a2a2a] rounded-full text-sm text-gray-700 dark:text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            {/* Ratings */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 fill-white" />
                  <span className="text-sm font-medium">Critics Score</span>
                </div>
                <div className="text-3xl font-bold">
                  {gameInfo.aggregated_rating
                    ? Math.round(gameInfo.aggregated_rating)
                    : "N/A"}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  Based on {gameInfo.aggregated_rating_count || 0} reviews
                </div>
              </div>
              <div className="bg-gradient-to-br from-[#50FCBC] to-yellow-500 rounded-lg p-4 text-white">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5" />
                  <span className="text-sm font-medium">User Score</span>
                </div>
                <div className="text-3xl font-bold">
                  {gameInfo.rating ? Math.round(gameInfo.rating) : "N/A"}
                </div>
                <div className="text-xs opacity-90 mt-1">
                  Based on {gameInfo.rating_count || 0} ratings
                </div>
              </div>
            </div>

            {gameInfo.summary && (
              <div className="bg-gray-50 dark:bg-[#0a0a0a] rounded-lg p-4">
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  Synopsis
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {gameInfo.summary}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      {(gameInfo.storyline ||
        gameInfo.involved_companies ||
        gameInfo.game_modes) && (
        <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Additional Information
          </h2>

          {gameInfo.storyline && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                Storyline
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {gameInfo.storyline}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameInfo.involved_companies &&
              gameInfo.involved_companies.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Companies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {gameInfo.involved_companies.map((company) => (
                      <span
                        key={company.company?.id || company.company?.name}
                        className="px-3 py-1 bg-gray-200 dark:bg-[#2a2a2a] rounded-full text-sm text-gray-700 dark:text-gray-300"
                      >
                        {company.company?.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {gameInfo.game_modes && gameInfo.game_modes.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                  Game Modes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {gameInfo.game_modes.map((mode) => (
                    <span
                      key={mode.id || mode.name}
                      className="px-3 py-1 bg-gray-200 dark:bg-[#2a2a2a] rounded-full text-sm text-gray-700 dark:text-gray-300"
                    >
                      {mode.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {similarGames && similarGames.length > 0 && (
        <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              You Might Also Like
            </h2>
            <div className="h-1 flex-grow bg-gradient-to-r from-[#50FCBC] to-transparent rounded" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {similarGames.map((game, idx) => (
              <SmallGameCard
                key={`recommendation-${game.id}`}
                game={game}
                rank={idx + 1}
              />
            ))}
          </div>
        </div>
      )}
      {/* Add Comment */}
      {gameStatus != null && (
        <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg p-6 mb-6">
          {/* Titlu */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Tell The World What You Think
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Write a review for{" "}
              <span className="font-semibold">{gameInfo.name}</span>
            </p>
          </div>

          {/* Container principal: Poza + Câmp recenzie + Scor */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poza utilizatorului (stânga) */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <img
                src={"/logo.png"} // Poza implicită dacă nu există
                alt="User Avatar"
                className="w-20 h-20 rounded-lg object-cover border-2 border-gray-300 dark:border-gray-600"
              />
              <p className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Your Review
              </p>
            </div>

            {/* Câmp recenzie + Scor (dreapta) */}
            <div className="flex-grow">
              {/* Câmp text pentru recenzie */}
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Please describe what you liked or disliked about this game and whether you recommend it to others. Be polite and follow the rules and guidelines."
                className="w-full p-4 bg-gray-100 dark:bg-[#2a2a2a] rounded-lg border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-[#50FCBC] focus:outline-none min-h-[150px] resize-y"
              />

              {/* Scor (0-100) */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Your Rating:
                  </label>
                  <span className="text-lg font-bold text-[#50FCBC]">
                    {score > 0 ? `${score}/100` : "No rating"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      // Dacă dai click pe steaua 4, scorul devine 4 * 20 = 80
                      onClick={() => setScore(star * 20)}
                      className={`text-3xl transition-colors focus:outline-none ${
                        // Colorăm stelele în funcție de scorul actual
                        score >= star * 20
                          ? "text-yellow-400 hover:text-yellow-300"
                          : "text-gray-300 dark:text-gray-600 hover:text-gray-400 dark:hover:text-gray-500"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Buton de trimitere */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-[#50FCBC] hover:bg-[#3dd69f] text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Section */}
      <div className="bg-white dark:bg-[#1C1C1C] rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            User Reviews
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sort by:
            </span>
            <select
              value={reviewSortBy}
              onChange={(e) => setReviewSortBy(e.target.value)}
              className="px-3 py-2 bg-gray-100 dark:bg-[#2a2a2a] text-gray-900 dark:text-white rounded-lg border-none focus:ring-2 focus:ring-[#FFD700] transition-all"
            >
              <option value="likes">Most Likes</option>
              <option value="dislikes">Most Dislikes</option>
              <option value="karma">User Karma</option>
            </select>
          </div>
        </div>

        <div>
          {getSortedReviews().map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No reviews yet. Be the first to review this game!
          </div>
        )}
      </div>
    </div>
  );
};

export default GamePage;
