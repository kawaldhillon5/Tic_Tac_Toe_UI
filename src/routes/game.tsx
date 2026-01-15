import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useSocket } from '../hooks/useSocket';
import type { GameState } from '../types/game';
import '../css/game.css';

export default function Game() {
    const { gameId } = useParams<{ gameId: string }>();
    const [game, setGame] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(true);
    const socket = useSocket(gameId);

    // 1. Initial Load: Fetch the game from the SQLite DB
    useEffect(() => {
        const fetchGame = async () => {
            try {
                const response = await api.get(`/game/${gameId}`);
                setGame(response.data.game);
            } catch (err) {
                console.error("Game not found", err);
            } finally {
                setLoading(false);
            }
        };
        fetchGame();
    }, [gameId]);

    // 2. Real-time listener: Update state when the server emits 'game-updated'
    useEffect(() => {
        if (!socket) return;

        socket.on('game-updated', (updatedGame: GameState) => {
            setGame(updatedGame);
        });

        return () => { socket.off('game-updated'); };
    }, [socket]);

    // 3. Action: Send the move to the backend
    const handleCellClick = async (row: number, col: number) => {
        if (!game || game.status !== 'ongoing' || game.board[row][col]) return;

        try {
            // We use the player from the current state as the one moving
            await api.post('/game/move', {
                gameId: game.id,
                row,
                column: col,
                player: game.current_turn
            });
            // Note: We don't setGame here; we wait for the Socket to emit the update
        } catch (err: any) {
            alert(err.response?.data?.error || "Move failed");
        }
    };

    if (loading) return <div className="status">Loading Game...</div>;
    if (!game) return <div className="status">Game Not Found</div>;

    return (
        <div className="game-container">
            <div className="game-info">
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