// 기물 상수
export const EMPTY = 0;
export const W_PAWN = 1;
export const W_KNIGHT = 2;
export const W_BISHOP = 3;
export const W_ROOK = 4;
export const W_LEAPER = 5;
export const W_QUEEN = 6;
export const W_KING = 7;
export const W_GENERAL = 8;

export const B_PAWN = -1;
export const B_KNIGHT = -2;
export const B_BISHOP = -3;
export const B_ROOK = -4;
export const B_LEAPER = -5;
export const B_QUEEN = -6;
export const B_KING = -7;
export const B_GENERAL = -8;

export const PIECE_NAMES = {
  1: 'P', 2: 'N', 3: 'B', 4: 'R', 5: 'L', 6: 'Q', 7: 'K', 8: 'G',
  [-1]: 'P', [-2]: 'N', [-3]: 'B', [-4]: 'R', [-5]: 'L', [-6]: 'Q', [-7]: 'K', [-8]: 'G'
};

// 이동 방향
export const DIRECTIONS_8 = [[0,1],[1,0],[0,-1],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1]];
export const DIRECTIONS_4_ORTHO = [[0,1],[1,0],[0,-1],[-1,0]];
export const DIRECTIONS_4_DIAG = [[1,1],[1,-1],[-1,1],[-1,-1]];
export const KNIGHT_MOVES = [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]];
