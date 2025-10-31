import React from 'react';
import { EMPTY, PIECE_NAMES } from '../constants/pieces.js';

const ChessBoard = ({
  board,
  selectedSquare,
  legalMoves,
  onSquareClick,
  whiteCaptured,
  blackCaptured
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f'];

  const renderCaptured = (captured, color) => {
    const pieces = Object.entries(captured).map(([piece, count]) => {
      return count > 1 ? `${piece}×${count}` : piece;
    });

    return (
      <div className={`flex gap-2 text-sm ${color === 'white' ? 'text-blue-300' : 'text-red-300'}`}>
        {pieces.length > 0 ? pieces.join(' ') : '—'}
      </div>
    );
  };

  return (
    <div className="bg-slate-700 p-4 rounded-lg shadow-2xl">
      <div className="mb-3 px-8 h-6 flex items-center">
        <span className="text-slate-400 text-xs mr-2">잡힌 백:</span>
        {renderCaptured(whiteCaptured, 'white')}
      </div>

      <div className="mb-2 flex justify-around px-8">
        {files.map(f => (
          <div key={f} className="text-slate-300 font-mono text-sm w-16 text-center">{f}</div>
        ))}
      </div>

      {[5, 4, 3, 2, 1, 0].map((row) => (
        <div key={row} className="flex items-center">
          <div className="text-slate-300 font-mono text-sm w-8 text-center">{row + 1}</div>
          {[0, 1, 2, 3, 4, 5].map((col) => {
            const piece = board[row][col];
            const isSelected = selectedSquare && selectedSquare[0] === row && selectedSquare[1] === col;
            const isLegalMove = legalMoves.some(([mr, mc]) => mr === row && mc === col);
            const isDark = (row + col) % 2 === 1;

            return (
              <div
                key={`${row}-${col}`}
                onClick={() => onSquareClick(row, col)}
                className={`
                  w-16 h-16 flex items-center justify-center cursor-pointer
                  border border-slate-600 relative
                  ${isDark ? 'bg-slate-600' : 'bg-slate-400'}
                  ${isSelected ? 'ring-4 ring-yellow-400' : ''}
                  ${isLegalMove ? 'ring-2 ring-green-400' : ''}
                  hover:brightness-110 transition-all
                `}
              >
                {isLegalMove && (
                  <div className="absolute inset-0 bg-green-400 opacity-30 rounded-full m-4"></div>
                )}
                {piece !== EMPTY && (
                  <div className={`
                    text-2xl font-bold z-10
                    ${piece > 0 ? 'text-blue-200' : 'text-red-300'}
                    ${isSelected ? 'scale-110' : ''}
                    transition-transform
                  `}>
                    {PIECE_NAMES[piece]}
                  </div>
                )}
              </div>
            );
          })}
          <div className="text-slate-300 font-mono text-sm w-8 text-center">{row + 1}</div>
        </div>
      ))}

      <div className="mt-2 flex justify-around px-8">
        {files.map(f => (
          <div key={f} className="text-slate-300 font-mono text-sm w-16 text-center">{f}</div>
        ))}
      </div>

      <div className="mt-3 px-8 h-6 flex items-center">
        <span className="text-slate-400 text-xs mr-2">잡힌 흑:</span>
        {renderCaptured(blackCaptured, 'black')}
      </div>
    </div>
  );
};

export default ChessBoard;
