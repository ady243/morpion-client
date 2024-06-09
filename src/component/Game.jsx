import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from "../context/AuthContext.jsx";
import { ChatContext } from '../context/ChatContext.jsx';
import { Button } from '@nextui-org/react';
import { baseUrl } from '../utils/services.js';

import "./game.css";

const Game = () => {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const { token } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [players, setPlayers] = useState({ X: null, O: null });
    const [role, setRole] = useState(null);
    const [room, setRoom] = useState(null);
    const { onlineUsers, setOnlineUsers } = useContext(ChatContext);
    

    useEffect(() => {
        const newSocket = io('https://morpion-soket-back.onrender.com', { query: { token } });
        setSocket(newSocket);
    
        newSocket.on('connect', () => {
            console.log('Connected to server');
        });
        newSocket.on('role', (assignedRole) => {
            setRole(assignedRole);
        });

        newSocket.on('players', (playersData) => {
            setPlayers(playersData);
        });

        newSocket.on('onlineUsers', (users) => {
            setOnlineUsers(users);
        });

        newSocket.on('joinedRoom', (room) => {
            setRoom(room);
        });

        return () => newSocket.close();
    }, [token]);

    const recordWin = async () => {
        try {
            const response = await fetch(`${baseUrl}/users/win`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to record win');
            }
    
            const data = await response.json();
           
        } catch (error) {
            console.error('Error recording win:', error.message);
        }
    };

    const joinRoom = (roomName) => {
        socket.emit('joinRoom', roomName);
    };

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    };

    const handlePlay = (i) => {
        const currentSquares = history[currentMove];
        if (calculateWinner(currentSquares) || currentSquares[i]) return;

        if ((currentPlayer === 'X' && role !== 'X') || (currentPlayer === 'O' && role !== 'O')) return;
    
        const nextSquares = currentSquares.slice();
        nextSquares[i] = currentPlayer;
        const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
    
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
        setCurrentPlayer(nextPlayer);
    
        if (socket) {
            socket.emit('move', {
                history: nextHistory,
                currentMove: nextHistory.length - 1,
                currentPlayer: nextPlayer
            });
        }
    };

    const Square = ({ value, onClick }) => (
        <button className="button" onClick={onClick}>
            <span className={`${value === 'X' ? 'text-red-500' : 'text-blue-500'}`}>{value}</span>
        </button>
    );

    const Board = () => (
        <>
            <div className="mb-4 font-bold">{room ? `Salon: ${room}` : 'En attente de salon'}</div>
            {[0, 1, 2].map((row) => (
                <div className="flex" key={row} style={{ justifyContent: 'center' }}>
                    {[0, 1, 2].map((col) => (
                        <Square
                            key={col}
                            value={history[currentMove][row * 3 + col]}
                            onClick={() => handlePlay(row * 3 + col)}
                        />
                    ))}
                </div>
            ))}
        </>
    );

    return (
        <div className="container">
            <div>
                <h2>Utilisateurs en ligne :</h2>
                <ul>
                    {onlineUsers && onlineUsers.map((user, index) => (
                        <li key={user.id || index}>
                            {user.fullName} 
                            <Button 
                                onClick={() => joinRoom(user.room)}
                                className="additional-classes-for-game-button">
                                Rejoindre le salon
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="w-full max-w-md p-4 mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <Board />
                </div>
            </div>
        </div>
    );
};

export default Game;
