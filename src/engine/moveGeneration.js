// 기물별 이동 수 생성
import {
  EMPTY, W_PAWN, W_KNIGHT, W_BISHOP, W_ROOK, W_LEAPER, W_QUEEN, W_KING, W_GENERAL,
  DIRECTIONS_8, DIRECTIONS_4_ORTHO, DIRECTIONS_4_DIAG, KNIGHT_MOVES
} from '../constants/pieces.js';
import { inBounds, isEnemy } from './boardUtils.js';

export function getPawnMoves(b, row, col, piece) {
  const moves = [];
  const direction = piece > 0 ? 1 : -1;

  const newRow = row + direction;
  if (inBounds(newRow, col) && b[newRow][col] === EMPTY) {
    moves.push([newRow, col]);
  }

  for (const dc of [-1, 1]) {
    const newCol = col + dc;
    if (inBounds(row, newCol) && b[row][newCol] === EMPTY) {
      moves.push([row, newCol]);
    }
  }

  for (const dc of [-1, 1]) {
    const newCol = col + dc;
    if (inBounds(newRow, newCol) && isEnemy(b[newRow][newCol], piece)) {
      moves.push([newRow, newCol]);
    }
  }

  return moves;
}

export function getKnightMoves(b, row, col, piece) {
  const moves = [];
  for (const [dr, dc] of KNIGHT_MOVES) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (inBounds(newRow, newCol)) {
      const target = b[newRow][newCol];
      if (target === EMPTY || isEnemy(target, piece)) {
        moves.push([newRow, newCol]);
      }
    }
  }
  return moves;
}

export function getBishopMoves(b, row, col, piece) {
  const moves = [];

  for (const [dr, dc] of DIRECTIONS_4_DIAG) {
    for (let dist = 1; dist <= 3; dist++) {
      const newRow = row + dr * dist;
      const newCol = col + dc * dist;
      if (!inBounds(newRow, newCol)) break;
      const target = b[newRow][newCol];
      if (target === EMPTY) {
        moves.push([newRow, newCol]);
      } else if (isEnemy(target, piece)) {
        moves.push([newRow, newCol]);
        break;
      } else {
        break;
      }
    }
  }

  for (const [dr, dc] of DIRECTIONS_4_ORTHO) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (inBounds(newRow, newCol)) {
      const target = b[newRow][newCol];
      if (target === EMPTY || isEnemy(target, piece)) {
        moves.push([newRow, newCol]);
      }
    }
  }

  return moves;
}

export function getRookMoves(b, row, col, piece) {
  const moves = [];

  for (const [dr, dc] of DIRECTIONS_4_ORTHO) {
    for (let dist = 1; dist <= 3; dist++) {
      const newRow = row + dr * dist;
      const newCol = col + dc * dist;
      if (!inBounds(newRow, newCol)) break;
      const target = b[newRow][newCol];
      if (target === EMPTY) {
        moves.push([newRow, newCol]);
      } else if (isEnemy(target, piece)) {
        moves.push([newRow, newCol]);
        break;
      } else {
        break;
      }
    }
  }

  for (const [dr, dc] of DIRECTIONS_4_DIAG) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (inBounds(newRow, newCol)) {
      const target = b[newRow][newCol];
      if (target === EMPTY || isEnemy(target, piece)) {
        moves.push([newRow, newCol]);
      }
    }
  }

  return moves;
}

export function getLeaperMoves(b, row, col, piece) {
  const moves = [];

  for (const [dr, dc] of DIRECTIONS_8) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (inBounds(newRow, newCol)) {
      const target = b[newRow][newCol];
      // 기본 8방향 1칸 이동
      if (target === EMPTY || isEnemy(target, piece)) {
        moves.push([newRow, newCol]);
      }

      // 인접한 칸에 기물이 있으면 (흑백 상관없이) 뛰어넘기 가능
      if (target !== EMPTY) {
        const jumpRow = row + dr * 2;
        const jumpCol = col + dc * 2;
        if (inBounds(jumpRow, jumpCol)) {
          const jumpTarget = b[jumpRow][jumpCol];
          // 도착 칸이 비어있거나 적 기물이면 가능
          if (jumpTarget === EMPTY || isEnemy(jumpTarget, piece)) {
            moves.push([jumpRow, jumpCol]);
          }
        }
      }
    }
  }

  return moves;
}

export function getQueenMoves(b, row, col, piece) {
  const moves = [];
  for (const [dr, dc] of DIRECTIONS_8) {
    for (let dist = 1; dist <= 3; dist++) {
      const newRow = row + dr * dist;
      const newCol = col + dc * dist;
      if (!inBounds(newRow, newCol)) break;
      const target = b[newRow][newCol];
      if (target === EMPTY) {
        moves.push([newRow, newCol]);
      } else if (isEnemy(target, piece)) {
        moves.push([newRow, newCol]);
        break;
      } else {
        break;
      }
    }
  }
  return moves;
}

export function getKingMoves(b, row, col, piece) {
  const moves = [];
  for (const [dr, dc] of DIRECTIONS_8) {
    const newRow = row + dr;
    const newCol = col + dc;
    if (inBounds(newRow, newCol)) {
      const target = b[newRow][newCol];
      if (target === EMPTY || isEnemy(target, piece)) {
        moves.push([newRow, newCol]);
      }
    }
  }
  return moves;
}

export function getPseudoLegalMoves(b, row, col) {
  const piece = b[row][col];
  if (piece === EMPTY) return [];

  const absPiece = Math.abs(piece);

  if (absPiece === Math.abs(W_PAWN)) return getPawnMoves(b, row, col, piece);
  if (absPiece === Math.abs(W_KNIGHT)) return getKnightMoves(b, row, col, piece);
  if (absPiece === Math.abs(W_BISHOP)) return getBishopMoves(b, row, col, piece);
  if (absPiece === Math.abs(W_ROOK)) return getRookMoves(b, row, col, piece);
  if (absPiece === Math.abs(W_LEAPER)) return getLeaperMoves(b, row, col, piece);
  if (absPiece === Math.abs(W_QUEEN)) return getQueenMoves(b, row, col, piece);
  if (absPiece === Math.abs(W_KING) || absPiece === Math.abs(W_GENERAL)) {
    return getKingMoves(b, row, col, piece);
  }

  return [];
}
