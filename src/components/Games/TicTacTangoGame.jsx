import React, { useState } from 'react';
import { RotateCcw, Users, Flower2, Leaf } from 'lucide-react';

const btn = 'rounded-2xl font-bold transition-all active:scale-95 select-none';

export const TicTacTangoGame = ({ onScore }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  const checkWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (!squares.includes(null)) return 'Draw';
    return null;
  };

  const handleClick = (i) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = isXNext ? 'Lotus' : 'Leaf';
    setBoard(newBoard);
    setIsXNext(!isXNext);
    
    const gameWinner = checkWinner(newBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      setTimeout(() => setShowPrompt(true), 1500);
      if (onScore) onScore(100);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setShowPrompt(false);
  };

  const prompts = [
    "That was fun! Have you ever visited a garden with lotuses?",
    "Good game! Do you prefer the smell of flowers or fresh leaves?",
    "Well played! Who usually wins when you play games?",
    "Nice moves! What is your favorite outdoor activity?"
  ];
  
  const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

  return (
    <div className="space-y-6 text-center max-w-sm mx-auto">
      <div className="flex items-center justify-center gap-2 mb-4">
         <Users className="w-6 h-6 text-sky-600" />
         <p className="text-sky-600 font-semibold text-lg">Shared Play: Place device flat</p>
      </div>
      
      {!winner && (
        <p className="text-sky-800 font-bold text-xl animate-pulse flex items-center justify-center gap-2">
          {isXNext ? <><Flower2 className="text-rose-500 w-6 h-6"/> Lotus's Turn</> : <><Leaf className="text-emerald-500 w-6 h-6"/> Leaf's Turn</>}
        </p>
      )}
      
      {winner && !showPrompt && (
        <p className="text-3xl font-black text-sky-700 animate-bounce">
          {winner === 'Draw' ? 'A Beautiful Tie!' : `${winner} Wins!`}
        </p>
      )}

      {showPrompt && (
        <div className="bg-sky-50 border-2 border-sky-200 p-6 rounded-3xl shadow-sm mb-6 animate-fade-in">
           <h3 className="text-sky-800 font-black text-xl mb-3">Time to Chat!</h3>
           <p className="text-sky-700 text-lg font-medium italic">"{randomPrompt}"</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-3 bg-sky-100 p-4 rounded-3xl shadow-inner max-w-[320px] mx-auto">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="aspect-square bg-white rounded-2xl shadow-sm flex items-center justify-center text-5xl transition hover:bg-sky-50 active:scale-95"
            disabled={winner !== null || cell !== null}
          >
            {cell === 'Lotus' && <Flower2 className="w-16 h-16 text-rose-500 drop-shadow-md" />}
            {cell === 'Leaf' && <Leaf className="w-16 h-16 text-emerald-500 drop-shadow-md" />}
          </button>
        ))}
      </div>

      {winner && (
         <button onClick={resetGame} className={`${btn} mt-6 px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white flex items-center gap-2 mx-auto shadow-lg`}>
          <RotateCcw className="w-5 h-5" /> Play Again
        </button>
      )}
    </div>
  );
};
