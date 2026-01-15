import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Home() {
  const navigate = useNavigate();

  const handleStartGame = async () => {
    try {
      const response = await api.post("/game/create-game");
      const { gameId } = response.data;

      navigate(`/game/${gameId}`);
    } catch (err) {
      console.error("Failed to initialize game:", err);
    }
  };

  return (
    <div className="home-container">
      <h2>Ready to Play?</h2>
      <button className="primary-btn" onClick={handleStartGame}>
        Start New Online Game
      </button>
    </div>
  );
}