import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Star, Plus, Check, Clock, Play } from "lucide-react";
import api from "../api/axios";

const GamePage = () => {
  const { id } = useParams();
  const [gameInfo, setGameInfo] = useState({});
  const [similarGames, setSimilarGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        console.log("Fetching data for ID:", id);
        const response = await api.get(`api/game/game_data/${id}`);
        const data = response.data;

        const game_info = data.game_info;
        const game_recommendations = data.game_recommendations;

        setGameInfo(game_info);
        setSimilarGames(game_recommendations);
      } catch (error) {
        console.error("Failed to fetch game info:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!gameInfo) return <div>Game not found.</div>;

  return <div>{gameInfo.name}</div>;
};

export default GamePage;
