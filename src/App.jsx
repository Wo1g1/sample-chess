import React, { useState, useEffect } from 'react';
import ChessBoard from './ui/ChessBoard.jsx';
import { EMPTY, W_PAWN, W_GENERAL, B_GENERAL, PIECE_NAMES } from './constants/pieces.js';
import { createInitialBoard, getPositionHash } from './engine/boardUtils.js';
import { getPseudoLegalMoves } from './engine/moveGeneration.js';
import { isInCheck, checkGameOver } from './engine/gameLogic.js';
import { getBestMove } from './engine/ai.js';

const App = () => {
  const initialBoard = createInitialBoard();
  const [gameMode, setGameMode] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [turn, setTurn] = useState(1);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [boardHistory, setBoardHistory] = useState([initialBoard]);
  const [turnHistory, setTurnHistory] = useState([1]);
  const [positionHistory, setPositionHistory] = useState([getPositionHash(initialBoard)]);
  const [halfmoveClock, setHalfmoveClock] = useState(0);
  const [halfmoveHistory, setHalfmoveHistory] = useState([0]);
  const [gameOver, setGameOver] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  function handleSquareClick(row, col) {
    if (gameOver || isAiThinking) return;
    if (gameMode === 'ai' && turn !== playerColor) return;

    const piece = board[row][col];

    if (selectedSquare) {
      const [fromRow, fromCol] = selectedSquare;
      const isLegalMove = legalMoves.some(([mr, mc]) => mr === row && mc === col);

      if (isLegalMove) {
        makeMove(fromRow, fromCol, row, col);
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }

    if (piece !== EMPTY && ((piece > 0) === (turn > 0))) {
      setSelectedSquare([row, col]);
      const moves = getPseudoLegalMoves(board, row, col);

      const legal = moves.filter(([toRow, toCol]) => {
        const newBoard = board.map(r => [...r]);
        newBoard[toRow][toCol] = piece;
        newBoard[row][col] = EMPTY;

        if (Math.abs(piece) === Math.abs(W_PAWN)) {
          if ((piece > 0 && toRow === 5) || (piece < 0 && toRow === 0)) {
            newBoard[toRow][toCol] = piece > 0 ? W_GENERAL : B_GENERAL;
          }
        }

        return !isInCheck(newBoard, turn);
      });

      setLegalMoves(legal);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }

  function makeMove(fromRow, fromCol, toRow, toCol) {
    const newBoard = board.map(r => [...r]);
    const piece = newBoard[fromRow][fromCol];
    const captured = newBoard[toRow][toCol];

    newBoard[toRow][toCol] = piece;
    newBoard[fromRow][fromCol] = EMPTY;

    if (Math.abs(piece) === Math.abs(W_PAWN)) {
      if ((piece > 0 && toRow === 5) || (piece < 0 && toRow === 0)) {
        newBoard[toRow][toCol] = piece > 0 ? W_GENERAL : B_GENERAL;
      }
    }

    let newHalfmove = halfmoveClock + 1;
    if (Math.abs(piece) === Math.abs(W_PAWN) || captured !== EMPTY) {
      newHalfmove = 0;
    }

    setBoard(newBoard);
    setTurn(-turn);
    setMoveHistory([...moveHistory, [fromRow, fromCol, toRow, toCol, captured]]);
    setBoardHistory([...boardHistory, newBoard]);
    setTurnHistory([...turnHistory, -turn]);
    setPositionHistory([...positionHistory, getPositionHash(newBoard)]);
    setHalfmoveClock(newHalfmove);
    setHalfmoveHistory([...halfmoveHistory, newHalfmove]);

    const gameOverMsg = checkGameOver(
      newBoard,
      -turn,
      [...positionHistory, getPositionHash(newBoard)],
      newHalfmove
    );
    if (gameOverMsg) {
      setGameOver(gameOverMsg);
    }
  }

  function resetGame() {
    const initial = createInitialBoard();
    setBoard(initial);
    setTurn(1);
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory([]);
    setBoardHistory([initial]);
    setTurnHistory([1]);
    setPositionHistory([getPositionHash(initial)]);
    setHalfmoveClock(0);
    setHalfmoveHistory([0]);
    setGameOver(null);
    setGameMode(null);
    setPlayerColor(null);
    setIsAiThinking(false);
  }

  function undoMove() {
    if (moveHistory.length === 0) return;

    const newMoveHistory = moveHistory.slice(0, -1);
    const newBoardHistory = boardHistory.slice(0, -1);
    const newTurnHistory = turnHistory.slice(0, -1);
    const newPositionHistory = positionHistory.slice(0, -1);
    const newHalfmoveHistory = halfmoveHistory.slice(0, -1);

    setBoard(newBoardHistory[newBoardHistory.length - 1]);
    setTurn(newTurnHistory[newTurnHistory.length - 1]);
    setMoveHistory(newMoveHistory);
    setBoardHistory(newBoardHistory);
    setTurnHistory(newTurnHistory);
    setPositionHistory(newPositionHistory);
    setHalfmoveClock(newHalfmoveHistory[newHalfmoveHistory.length - 1]);
    setHalfmoveHistory(newHalfmoveHistory);
    setSelectedSquare(null);
    setLegalMoves([]);
    setGameOver(null);
  }

  // AI 자동 수 실행
  useEffect(() => {
    if (gameMode === 'ai' && !gameOver && !isAiThinking && playerColor !== null && turn !== playerColor) {
      console.log('AI 차례 시작:', { turn, playerColor });
      setIsAiThinking(true);

      // 현재 보드 상태를 캡처
      const currentBoard = board;
      const currentTurn = turn;

      // 비동기로 AI 수 계산 및 실행
      const timer = setTimeout(() => {
        console.log('AI 계산 시작...');
        const startTime = performance.now();

        const [score, bestMove] = getBestMove(currentBoard, currentTurn);

        const endTime = performance.now();
        console.log(`AI 계산 완료 (${(endTime - startTime).toFixed(0)}ms):`, { score, bestMove });

        if (bestMove) {
          makeMove(bestMove[0], bestMove[1], bestMove[2], bestMove[3]);
        } else {
          console.error('AI가 수를 찾지 못했습니다!');
        }
        setIsAiThinking(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [turn, gameMode, playerColor, gameOver, isAiThinking]);

  function startGame(mode) {
    setGameMode(mode);
    if (mode === 'solo') {
      setPlayerColor(null);
    }
  }

  function selectColor(color) {
    setPlayerColor(color);
  }

  function getCapturedPieces() {
    const whiteCaptured = {};
    const blackCaptured = {};

    moveHistory.forEach(([fromRow, fromCol, toRow, toCol, captured]) => {
      if (captured !== EMPTY) {
        const pieceName = PIECE_NAMES[captured];
        if (captured > 0) {
          whiteCaptured[pieceName] = (whiteCaptured[pieceName] || 0) + 1;
        } else {
          blackCaptured[pieceName] = (blackCaptured[pieceName] || 0) + 1;
        }
      }
    });

    return { whiteCaptured, blackCaptured };
  }

  const { whiteCaptured, blackCaptured } = getCapturedPieces();

  if (gameMode === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
        <h1 className="text-5xl font-bold text-white mb-12">6×6 변형 체스</h1>
        <div className="flex gap-6">
          <button
            onClick={() => startGame('solo')}
            className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white text-2xl rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
          >
            혼자서 두기
          </button>
          <button
            onClick={() => startGame('ai')}
            className="px-12 py-6 bg-purple-600 hover:bg-purple-700 text-white text-2xl rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
          >
            AI와 두기
          </button>
        </div>
      </div>
    );
  }

  if (gameMode === 'ai' && playerColor === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
        <h1 className="text-4xl font-bold text-white mb-4">색상 선택</h1>
        <p className="text-slate-300 mb-8">어떤 색으로 플레이하시겠습니까?</p>
        <div className="flex gap-6">
          <button
            onClick={() => selectColor(1)}
            className="px-10 py-5 bg-blue-500 hover:bg-blue-600 text-white text-xl rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
          >
            백 (선공)
          </button>
          <button
            onClick={() => selectColor(-1)}
            className="px-10 py-5 bg-red-500 hover:bg-red-600 text-white text-xl rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
          >
            흑 (후공)
          </button>
          <button
            onClick={() => selectColor(Math.random() < 0.5 ? 1 : -1)}
            className="px-10 py-5 bg-slate-600 hover:bg-slate-700 text-white text-xl rounded-xl font-semibold shadow-lg transition-all hover:scale-105"
          >
            랜덤
          </button>
        </div>
        <button
          onClick={() => setGameMode(null)}
          className="mt-8 px-6 py-2 bg-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg"
        >
          ← 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">6×6 변형 체스</h1>
        <div className="text-xl text-slate-300">
          {gameOver ? (
            <div className="text-yellow-400 font-bold">{gameOver}</div>
          ) : isAiThinking ? (
            <div className="text-purple-400">AI 생각 중...</div>
          ) : (
            <div>현재 차례: <span className={turn === 1 ? 'text-blue-400' : 'text-red-400'}>
              {turn === 1 ? '백' : '흑'}
            </span></div>
          )}
        </div>
        <div className="mt-4 flex gap-3">
          {gameOver && (
            <button
              onClick={resetGame}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
            >
              새 게임
            </button>
          )}
          <button
            onClick={undoMove}
            disabled={moveHistory.length === 0}
            className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            무르기
          </button>
        </div>
      </div>

      <ChessBoard
        board={board}
        selectedSquare={selectedSquare}
        legalMoves={legalMoves}
        onSquareClick={handleSquareClick}
        whiteCaptured={whiteCaptured}
        blackCaptured={blackCaptured}
      />

      <div className="mt-6 text-slate-300 text-sm max-w-md text-center">
        <div className="mb-2">
          <span className="text-blue-300 font-bold">백(청)</span>: P(폰) N(나이트) B(비숍) R(룩) L(리퍼) Q(퀸) K(킹) G(장군)
        </div>
        <div>
          <span className="text-red-300 font-bold">흑(적)</span>: P(폰) N(나이트) B(비숍) R(룩) L(리퍼) Q(퀸) K(킹) G(장군)
        </div>
      </div>
    </div>
  );
};

export default App;
