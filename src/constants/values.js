import {
  EMPTY, W_PAWN, W_KNIGHT, W_BISHOP, W_ROOK, W_LEAPER,
  W_QUEEN, W_GENERAL, W_KING,
  B_PAWN, B_KNIGHT, B_BISHOP, B_ROOK, B_LEAPER,
  B_QUEEN, B_GENERAL, B_KING
} from './pieces.js';

// 기물 가치
export const PIECE_VALUES = {
  [W_PAWN]: 1.5,
  [W_KNIGHT]: 3.5,
  [W_BISHOP]: 4.5,
  [W_ROOK]: 4.5,
  [W_LEAPER]: 5.0,
  [W_QUEEN]: 6.5,
  [W_GENERAL]: 4.0,
  [W_KING]: 0,
  [B_PAWN]: -1.5,
  [B_KNIGHT]: -3.5,
  [B_BISHOP]: -4.5,
  [B_ROOK]: -4.5,
  [B_LEAPER]: -5.0,
  [B_QUEEN]: -6.5,
  [B_GENERAL]: -4.0,
  [B_KING]: 0,
  [EMPTY]: 0
};

// 중앙 칸 (위치 가치)
export const CENTER_SQUARES = new Set(['2,2', '2,3', '3,2', '3,3']);
export const SEMI_CENTER = new Set(['1,2', '1,3', '2,1', '2,4', '3,1', '3,4', '4,2', '4,3']);
