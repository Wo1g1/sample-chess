import React, { useState, useEffect } from 'react';
import ChessBoard from './ui/ChessBoard.jsx';
import { PIECE_NAMES } from './constants/pieces.js';
import FairyEngine from './engine/FairyEngine.js';

const App = () => {
  const [engine] = useState(() => new FairyEngine());
  const [engineReady, setEngineReady] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [playerColor, setPlayerColor] = useState(null);
  const [board, setBoard] = useState(null);
  const [turn, setTurn] = useState(1);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameOver, setGameOver] = useState(null);
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Fairy-Stockfish 초기화
  useEffect(() => {
    console.log('🚀 Fairy-Stockfish 초기화 시작...');
    engine.initialize().then(success => {
      if (success) {
        setEngineReady(true);
        setBoard(engine.getBoardArray());
        console.log('✅ 엔진 준비 완료!');
      } else {
        console.error('❌ 엔진 초기화 실패');
      }
    });
  }, [engine]);

  function handleSquareClick(row, col) {
    if (!engineReady || gameOver || isAiThinking) return;
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

    if (piece !== 0 && ((piece > 0) === (turn > 0))) {
      setSelectedSquare([row, col]);
      const moves = engine.getLegalMovesFrom(row, col);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }

  function makeMove(fromRow, fromCol, toRow, toCol) {
    const success = engine.makeMove(fromRow, fromCol, toRow, toCol);

    if (!success) {
      console.error('수 실행 실패');
      return;
    }

    // 보드 업데이트
    const newBoard = engine.getBoardArray();
    setBoard(newBoard);
    setTurn(-turn);
    setMoveHistory([...moveHistory, { fromRow, fromCol, toRow, toCol }]);

    // 게임 종료 체크
    if (engine.isGameOver()) {
      const result = engine.getResult();
      let message = '';

      if (result === '1-0') {
        message = '체크메이트! 백 승리!';
      } else if (result === '0-1') {
        message = '체크메이트! 흑 승리!';
      } else if (result === '1/2-1/2') {
        message = '무승부!';
      } else {
        message = `게임 종료: ${result}`;
      }

      setGameOver(message);
      console.log('게임 종료:', message);
    }
  }

  function resetGame() {
    engine.reset();
    setBoard(engine.getBoardArray());
    setTurn(1);
    setSelectedSquare(null);
    setLegalMoves([]);
    setMoveHistory([]);
    setGameOver(null);
    setGameMode(null);
    setPlayerColor(null);
    setIsAiThinking(false);
  }

  function undoMove() {
    if (moveHistory.length === 0) return;

    const success = engine.undo();
    if (success) {
      setBoard(engine.getBoardArray());
      setTurn(-turn);
      setMoveHistory(moveHistory.slice(0, -1));
      setSelectedSquare(null);
      setLegalMoves([]);
      setGameOver(null);
    }
  }

  // AI 자동 수 실행
  useEffect(() => {
    if (!engineReady) return;
    if (gameMode === 'ai' && !gameOver && !isAiThinking && playerColor !== null && turn !== playerColor) {
      console.log('🤖 AI 차례 시작:', { turn, playerColor });
      setIsAiThinking(true);

      // 비동기로 AI 수 계산 및 실행
      const timer = setTimeout(() => {
        console.log('🧠 AI 계산 시작... (depth 12)');
        const startTime = performance.now();

        const bestMove = engine.getBestMove(12); // depth 12!
        const evaluation = engine.getEvaluation();

        const endTime = performance.now();
        console.log(`✅ AI 계산 완료 (${(endTime - startTime).toFixed(0)}ms)`);
        console.log(`평가: ${evaluation.toFixed(2)}, 최선의 수:`, bestMove);

        if (bestMove) {
          const [fromRow, fromCol, toRow, toCol] = bestMove;
          makeMove(fromRow, fromCol, toRow, toCol);
        } else {
          console.error('❌ AI가 수를 찾지 못했습니다!');
        }

        setIsAiThinking(false);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [engineReady, turn, gameMode, playerColor, gameOver, isAiThinking]);

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

    // moveHistory에는 캡처 정보가 없으므로, 보드 비교로 추정
    // 간단하게 빈 객체 반환 (추후 개선 가능)

    return { whiteCaptured, blackCaptured };
  }

  const { whiteCaptured, blackCaptured } = getCapturedPieces();

  if (!engineReady) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
        <div className="text-white text-2xl mb-4">⏳ Fairy-Stockfish 로딩 중...</div>
        <div className="text-slate-400 text-sm">세계 최강급 AI 엔진 초기화 중입니다</div>
        <div className="mt-4 text-slate-500 text-xs">
          WASM 모듈 로드 및 변형 규칙 적용 중...
        </div>
      </div>
    );
  }

  if (gameMode === null) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
        <h1 className="text-5xl font-bold text-white mb-4">6×6 변형 체스</h1>
        <div className="text-green-400 text-sm mb-8">
          ✅ Powered by Fairy-Stockfish (World-class AI)
        </div>
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
            AI와 두기 (Depth 12)
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

  if (!board) {
    return <div className="text-white">보드 로딩 중...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 p-8">
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">6×6 변형 체스</h1>
        <div className="text-xs text-green-400 mb-2">Fairy-Stockfish Engine</div>
        <div className="text-xl text-slate-300">
          {gameOver ? (
            <div className="text-yellow-400 font-bold">{gameOver}</div>
          ) : isAiThinking ? (
            <div className="text-purple-400">🤖 AI 생각 중... (Depth 12)</div>
          ) : (
            <div>
              현재 차례: <span className={turn === 1 ? 'text-blue-400' : 'text-red-400'}>
                {turn === 1 ? '백' : '흑'}
              </span>
              {engine.isCheck() && <span className="text-red-500 ml-2">⚠️ 체크!</span>}
            </div>
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
        <div className="mt-4 text-xs text-slate-400">
          <div>🎯 Leaper: 8방향 1칸 + 인접 기물 있을 때 뛰어넘기</div>
          <div>🧠 AI: Stockfish 알고리즘 (Depth 12)</div>
        </div>
      </div>
    </div>
  );
};

export default App;
