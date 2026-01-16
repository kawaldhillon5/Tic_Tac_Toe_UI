import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import type { GameState } from '../types/game';

const SOCKET_URL = 'http://localhost:3000';

interface GameContextType {
    socket : Socket | null,
    username: string,
    game: GameState | null,
    setGame : (gameState: GameState | null) => void;
}

const GameContext = createContext<GameContextType>({} as GameContextType);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [username, setUsername] = useState<string>(() => {
        return localStorage.getItem('ticTacToeUsername') || "";
    });
    const [game, setGame] = useState<GameState | null>(null);


    useEffect(()=>{
        if (username.length > 0) {
            localStorage.setItem('ticTacToeUsername', username);
        }
    },[username]);


    useEffect(() => {
        // 1. Initialize Connection
        const s = io(SOCKET_URL);

        // 2. Set up permanent listeners
        const storedUsername = localStorage.getItem('ticTacToeUsername');
        if(storedUsername != null && storedUsername.length > 0) {
            setUsername(storedUsername);
            s.emit('assigned_username',username); 
        } else {
            s.emit('assigned_username',""); 
        }
        s.on('assigned_name', (name: string) => {
            console.log("Name assigned by server:", name);
            if(username.length === 0){
                setUsername((currentName) =>{
                    if(currentName.length === 0){
                        s.emit('assigned_username',name);
                        return name;
                    }
                    return currentName;
                });
                
            }
        });

        s.on('game-updated', (updatedGame: GameState) => {
            setGame(updatedGame);
        });

        setSocket(s);

        // 3. Cleanup on App Unmount
        return () => {
            s.off('assigned_name');
            s.off('game-updated');
            s.disconnect();
        };
    }, []);


    function updateLocalGame(gameState: GameState | null){
        setGame(gameState);
    }

    return <GameContext.Provider value={{socket, username, game, setGame:updateLocalGame}}>{children}</GameContext.Provider>
};

export const useGameConext =() =>{
    return useContext(GameContext);
}