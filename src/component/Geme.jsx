import React, { useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { AuthContext } from "../context/AuthContext.jsx";

const Game = () => {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const { token, currentUser } = useContext(AuthContext);
    const [socket, setSocket] = useState(null);
    const [currentPlayer, setCurrentPlayer] = useState('X');

    useEffect(() => {
        const newSocket = io('http://localhost:4000');
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('move', (moveData) => {
            setHistory(moveData.history);
            console.log('move', moveData);
            setCurrentMove(moveData.currentMove);
            console.log('move', moveData);
        });

        return () => socket.off('move');
    }, [socket]);

    useEffect(() => {
        if (!socket || !token) return;

        socket.emit('authenticate', { token });
        console.log('emitted', token);

        return () => socket.off('connect');
    }, [socket, token]);


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
        if (calculateWinner(history[currentMove]) || history[currentMove][i]) {
            return;
        }
        const nextSquares = history[currentMove].slice();
        nextSquares[i] = currentPlayer; // Utilisation du joueur actuel
        const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
        setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X'); 
        if (socket) {
            socket.emit('move', { history: nextHistory, currentMove: nextHistory.length - 1 });
        }
    };


    const currentSquares = history[currentMove];
    const xIsNext = currentMove % 2 === 0;
    const winner = calculateWinner(currentSquares);
    let status;
    if (winner) {
        status = currentUser ? currentUser.fullName : winner + ' a gagné';
    } else {
        status = 'Au tour de  ' + (xIsNext ? (currentUser ? currentUser.fullName : 'X') : 'O');
    }

    const buttonStyle = {
        width: '200px',
        height: '150px',
        margin: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px solid #333',
        borderRadius: '5px',
        backgroundColor: '#fff',
        color: '#333',
        fontSize: '2em',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ':hover': {
            backgroundColor: '#f4f4f4',
            transform: 'scale(1.1)',
        }
    }

    const Square = ({ value, onClick }) => (
        <div>
            <button
                style={buttonStyle}
                onClick={onClick}
            >
                <span style={{color: value === 'X' ? 'red' : 'blue'}}>{value}</span>
            </button>
        </div>
    );
    const Board = () => (
        <>
            <div className="mb-4 text-2xl font-bold">{status}</div>
            {[0, 1, 2].map((row) => (
                <div className="flex" key={row}>
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
        <div className="flex justify-center items-center h-screen">
            <div className="w-2/3">
                <div className=" p-6 ">
                    <div className="mb-8">
                        <Board />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Game;
