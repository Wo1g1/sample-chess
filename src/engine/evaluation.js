// 평가 함수
import { EMPTY, W_PAWN } from '../constants/pieces.js';
import { PIECE_VALUES, CENTER_SQUARES, SEMI_CENTER } from '../constants/values.js';
import { getPseudoLegalMoves } from './moveGeneration.js';

export function evaluatePosition(b) {
  let score = 0;

  // 1. 기물 가치
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      score += PIECE_VALUES[b[row][col]] || 0;
    }
  }

  // 2. 중앙 장악
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const piece = b[row][col];
      const absPiece = Math.abs(piece);
      if (absPiece === Math.abs(W_PAWN) || absPiece === 2 || absPiece === 5) {
        const key = `${row},${col}`;
        if (CENTER_SQUARES.has(key)) {
          score += piece > 0 ? 0.2 : -0.2;
        } else if (SEMI_CENTER.has(key)) {
          score += piece > 0 ? 0.1 : -0.1;
        }
      }
    }
  }

  // 3. 이동성 (의사합법수만 계산 - 빠름)
  let whiteMobility = 0;
  let blackMobility = 0;
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const piece = b[row][col];
      if (piece !== EMPTY) {
        const moves = getPseudoLegalMoves(b, row, col);
        if (piece > 0) {
          whiteMobility += moves.length;
        } else {
          blackMobility += moves.length;
        }
      }
    }
  }
  score += (whiteMobility - blackMobility) * 0.05;

  // 4. 폰 진행도
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      const piece = b[row][col];
      if (Math.abs(piece) === Math.abs(W_PAWN)) {
        if (piece > 0) {
          score += Math.max(0, (row - 1) * 0.15);
        } else {
          score -= Math.max(0, (4 - row) * 0.15);
        }
      }
    }
  }

  return score;
}

// 무브 오더링
export function orderMoves(b, moves) {
  return moves.sort((a, b) => {
    const [fr1, fc1, tr1, tc1] = a;
    const [fr2, fc2, tr2, tc2] = b;

    const cap1 = b[tr1][tc1] !== EMPTY ? Math.abs(PIECE_VALUES[b[tr1][tc1]]) : 0;
    const cap2 = b[tr2][tc2] !== EMPTY ? Math.abs(PIECE_VALUES[b[tr2][tc2]]) : 0;

    if (cap1 !== cap2) return cap2 - cap1;

    const center1 = CENTER_SQUARES.has(`${tr1},${tc1}`) ? 1 : 0;
    const center2 = CENTER_SQUARES.has(`${tr2},${tc2}`) ? 1 : 0;

    return center2 - center1;
  });
}
