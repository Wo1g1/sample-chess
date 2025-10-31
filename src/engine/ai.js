// AI 알고리즘 (Minimax + Alpha-Beta)
import { EMPTY, W_PAWN, W_GENERAL, B_GENERAL } from '../constants/pieces.js';
import { getAllLegalMoves, isInCheck } from './gameLogic.js';
import { evaluatePosition, orderMoves } from './evaluation.js';

// 미니맥스 알고리즘
function minimax(b, depth, alpha, beta, maximizing) {
  if (depth === 0) {
    return [evaluatePosition(b), null];
  }

  const currentTurn = maximizing ? 1 : -1;
  const allMoves = getAllLegalMoves(b, currentTurn);

  if (allMoves.length === 0) {
    if (isInCheck(b, currentTurn)) {
      return [currentTurn === 1 ? -10000 : 10000, null];
    }
    return [0, null];
  }

  const orderedMoves = orderMoves(b, allMoves);
  let bestMove = null;

  if (maximizing) {
    let maxEval = -Infinity;
    for (const move of orderedMoves) {
      const [fromRow, fromCol, toRow, toCol] = move;
      const newBoard = b.map(r => [...r]);
      const piece = newBoard[fromRow][fromCol];

      newBoard[toRow][toCol] = piece;
      newBoard[fromRow][fromCol] = EMPTY;

      if (Math.abs(piece) === Math.abs(W_PAWN)) {
        if ((piece > 0 && toRow === 5) || (piece < 0 && toRow === 0)) {
          newBoard[toRow][toCol] = piece > 0 ? W_GENERAL : B_GENERAL;
        }
      }

      const [evalScore] = minimax(newBoard, depth - 1, alpha, beta, false);

      if (evalScore > maxEval) {
        maxEval = evalScore;
        bestMove = move;
      }
      alpha = Math.max(alpha, evalScore);
      if (beta <= alpha) break;
    }
    return [maxEval, bestMove];
  } else {
    let minEval = Infinity;
    for (const move of orderedMoves) {
      const [fromRow, fromCol, toRow, toCol] = move;
      const newBoard = b.map(r => [...r]);
      const piece = newBoard[fromRow][fromCol];

      newBoard[toRow][toCol] = piece;
      newBoard[fromRow][fromCol] = EMPTY;

      if (Math.abs(piece) === Math.abs(W_PAWN)) {
        if ((piece > 0 && toRow === 5) || (piece < 0 && toRow === 0)) {
          newBoard[toRow][toCol] = piece > 0 ? W_GENERAL : B_GENERAL;
        }
      }

      const [evalScore] = minimax(newBoard, depth - 1, alpha, beta, true);

      if (evalScore < minEval) {
        minEval = evalScore;
        bestMove = move;
      }
      beta = Math.min(beta, evalScore);
      if (beta <= alpha) break;
    }
    return [minEval, bestMove];
  }
}

export function getBestMove(b, currentTurn) {
  const maximizing = currentTurn === 1;
  return minimax(b, 2, -Infinity, Infinity, maximizing);
}
