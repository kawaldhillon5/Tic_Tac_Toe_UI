import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useGameConext } from '../hooks/useGame';
import '../css/game.css';

export default function Game() {
    const { gameId } = useParams<{ gameId: string }>();

    const {socket, username, game, setGame} = useGameConext();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await api.get(`/game/${gameId}`);
                setGame(response.data.game)
            } catch (err) {
                console.error("Game not found", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [gameId, socket]);

    const handleCellClick = async (row: number, col: number) => {
        if (!game || game.status !== 'ongoing' || game.board[row][col]) return;

        try {
            await api.post('/game/move', {
                gameId: game.id,
                row,
                column: col,
                player: game.current_turn
            });
        } catch (err: any) {
            alert(err.response?.data?.error || "Move failed");
        }
    };

    if (loading) return <div className="status">Loading Game...</div>;
    if (!game) return <div className="status">Game Not Found</div>;

    return (
        <div className="game-container">
            <div className="game-info">
                <h2>{username}</h2>
                <h2>Game ID: {gameId?.slice(0, 8)}...</h2>
                {game.status === 'ongoing' ? (
                    <p>Current Turn: <strong>{game.current_turn}</strong></p>
                ) : (
                    <p className="winner-msg">
                        {game.status === 'won' ? `Winner: ${game.winner}!` : "It's a Draw!"}
                    </p>
                )}
            </div>

            <div className="board">
                {game.board.map((row, rowIndex) => 
                    row.map((cell, colIndex) => (
                        <div 
                            key={`${rowIndex}-${colIndex}`} 
                            className="cell" 
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}