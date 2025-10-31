// 보드 유틸리티 함수들
import { EMPTY, W_LEAPER, W_BISHOP, W_QUEEN, W_KING, W_KNIGHT, W_ROOK, W_PAWN, B_PAWN, B_LEAPER, B_BISHOP, B_QUEEN, B_KING, B_KNIGHT, B_ROOK } from '../constants/pieces.js';

export function createInitialBoard() {
  const b = Array(6).fill().map(() => Array(6).fill(EMPTY));
  b[0] = [W_LEAPER, W_BISHOP, W_QUEEN, W_KING, W_KNIGHT, W_ROOK];
  b[1] = [W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN, W_PAWN];
  b[4] = [B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN, B_PAWN];
  b[5] = [B_LEAPER, B_BISHOP, B_QUEEN, B_KING, B_KNIGHT, B_ROOK];
  return b;
}

export function getPositionHash(b) {
  return JSON.stringify(b);
}

export function inBounds(row, col) {
  return row >= 0 && row < 6 && col >= 0 && col < 6;
}

export function isEnemy(piece, color) {
  if (piece === EMPTY) return false;
  return (piece > 0) !== (color > 0);
}

export function isAlly(piece, color) {
  if (piece === EMPTY) return false;
  return (piece > 0) === (color > 0);
}

export function findKing(b, color) {
  const targetKing = color > 0 ? W_KING : B_KING;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      if (b[row][col] === targetKing) {
        return [row, col];
      }
    }
  }
  return null;
}
