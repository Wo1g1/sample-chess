// 게임 규칙 및 합법성 검증
import { EMPTY, W_PAWN, W_GENERAL, B_GENERAL } from '../constants/pieces.js';
import { findKing, getPositionHash } from './boardUtils.js';
import { getPseudoLegalMoves } from './moveGeneration.js';

export function isSquareAttacked(b, row, col, byColor) {
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const piece = b[r][c];
      if (piece !== EMPTY && ((piece > 0) === (byColor > 0))) {
        const moves = getPseudoLegalMoves(b, r, c);
        if (moves.some(([mr, mc]) => mr === row && mc === col)) {
          return true;
        }
      }
    }
  }
  return false;
}

export function isInCheck(b, color) {
  const kingPos = findKing(b, color);
  if (!kingPos) return false;
  return isSquareAttacked(b, kingPos[0], kingPos[1], -color);
}

export function getAllLegalMoves(b, currentTurn) {
  const legalMoves = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const piece = b[row][col];
      if (piece !== EMPTY && ((piece > 0) === (currentTurn > 0))) {
        const moves = getPseudoLegalMoves(b, row, col);
        for (const [toRow, toCol] of moves) {
          const newBoard = b.map(r => [...r]);
          newBoard[toRow][toCol] = piece;
          newBoard[row][col] = EMPTY;

          if (Math.abs(piece) === Math.abs(W_PAWN)) {
            if ((piece > 0 && toRow === 5) || (piece < 0 && toRow === 0)) {
              newBoard[toRow][toCol] = piece > 0 ? W_GENERAL : B_GENERAL;
            }
          }

          if (!isInCheck(newBoard, currentTurn)) {
            legalMoves.push([row, col, toRow, toCol]);
          }
        }
      }
    }
  }
  return legalMoves;
}

export function checkGameOver(b, currentTurn, posHist, halfmove) {
  const allMoves = getAllLegalMoves(b, currentTurn);
  const inCheck = isInCheck(b, currentTurn);

  if (allMoves.length === 0) {
    if (inCheck) {
      const winner = currentTurn === 1 ? '흑' : '백';
      return `체크메이트! ${winner} 승리!`;
    } else {
      return '스테일메이트! 무승부';
    }
  }

  const currentPos = getPositionHash(b);
  const count = posHist.filter(p => p === currentPos).length;
  if (count >= 3) {
    return '3회 반복! 무승부';
  }

  if (halfmove >= 50) {
    return '50수 룰! 무승부';
  }

  return null;
}
