import {useContext, useEffect, useState} from 'react';
import io from 'socket.io-client';
import {AuthContext} from "../context/AuthContext.jsx";


const socket = io('http://localhost:4000');

function Game() {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        socket.on('move', (moveData) => {
            setHistory(moveData.history);
            setCurrentMove(moveData.currentMove);
        });
        return () => socket.disconnect();
    }, []);

    useEffect(() => {
        socket.on('connect', () => {
            socket.emit('authenticate', { token });
        });
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
        if (calculateWinner(history[currentMove]) || history[currentMove][i]) {
            return;
        }
        const nextSquares = history[currentMove].slice();
        nextSquares[i] = currentMove % 2 === 0 ? 'X' : 'O';
        const nextHistory = history.slice(0, currentMove + 1).concat([nextSquares]);
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    };



    const currentSquares = history[currentMove];
    const xIsNext = currentMove % 2 === 0;
    const winner = calculateWinner(currentSquares);
    let status;
    if (winner) {
        status = winner + ' a gagné';
    } else {
        status = 'Prochain tour : ' + (xIsNext ? 'ady' : 'user');
    }



    const styles = {
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
                style={styles}
                onClick={onClick}
            >
                {value}
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
}

export default Game;
