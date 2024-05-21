import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from "../context/AuthContext.jsx";
import "./game.css";

const Game = () => {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const { token } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState('X');
    const [players, setPlayers] = useState({ X: null, O: null });
    const [role, setRole] = useState(null);

    useEffect(() => {
        // const newSocket = io('http://localhost:4000', { query: { token } });
        const newSocket = io('https://morpion-soket-back.vercel.app', { query: { token } });
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected:', newSocket.id);
        });

        newSocket.on('role', (assignedRole) => {
            setRole(assignedRole);
        });

        newSocket.on('players', (playersData) => {
            setPlayers(playersData);
        });

        newSocket.on('move', (moveData) => {
            setHistory(moveData.history);
            setCurrentMove(moveData.currentMove);
            setCurrentPlayer(moveData.currentPlayer);
        });

        return () => newSocket.close();
    }, [token]);

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

    const currentSquares = history[currentMove];
    const winner = calculateWinner(currentSquares);
    const xIsNext = currentMove % 2 === 0;

    let status;
    if (winner) {
        if (players[winner]?.id === socket.id) {
            status = `Félicitations ${players[winner].name}, vous avez gagné!`;
        } else {
            status = `Désolé, vous avez perdu. ${players[winner].name} a gagné.`;
        }
        socket.emit('win', { winner: players[winner]?.id });
    } else {
        const nextPlayerName = xIsNext ? (role === 'X' ? (players.X?.name || 'Votre adversaire') : (players.O?.name || 'Votre adversaire')) : (role === 'O' ? (players.O?.name || 'Votre adversaire') : (players.X?.name || 'Votre adversaire'));
        status = `Au tour de ${nextPlayerName}`;
    }

    const Square = ({ value, onClick }) => (
        <button className="button" onClick={onClick}>
            <span className={`${value === 'X' ? 'text-red-500' : 'text-blue-500'}`}>{value}</span>
        </button>
    );

    const Board = () => (
        <>
            <div className="mb-4 font-bold">{status}</div>
            {[0, 1, 2].map((row) => (
                <div className="flex" key={row} style={{ justifyContent: 'center' }}>
                    {[0, 1, 2].map((col) => (
                        <Square
                            key={col}
                            value={currentSquares[row * 3 + col]}
                            onClick={() => handlePlay(row * 3 + col)}
                        />
                    ))}
                </div>
            ))}
        </>
    );

    return (
        <div className="container">
            <div className="w-full max-w-md p-4 mx-auto">
                <div className="bg-white p-4 rounded-lg shadow-lg">
                    <Board />
                </div>
            </div>
        </div>
    );
};

export default Game;
