import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

export const useSocket = (gameId: string | undefined) => {
    const socketRef = useRef<Socket | null>(null);

    useEffect(() => {
        // 1. Connect to the server
        socketRef.current = io(SOCKET_URL);
        console.log(socketRef.current)

        // 2. If we have a gameId, join that specific room immediately
        if (gameId) {
            socketRef.current.emit('join-game', gameId);
        }

        // 3. Cleanup on unmount
        return () => {
            socketRef.current?.disconnect();
        };
    }, [gameId]);

    return socketRef.current;
};