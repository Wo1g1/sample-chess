// Fairy-Stockfish WASM Engine Wrapper
import Module from 'ffish-es6';
import variantConfig from './variant-config.ini?raw';

class FairyEngine {
  constructor() {
    this.ffish = null;
    this.board = null;
    this.ready = false;
    this.variantName = 'CustomChess6x6';
  }

  async initialize() {
    try {
      console.log('Fairy-Stockfish 초기화 중...');

      // ffish-es6 모듈 로드
      this.ffish = await new Module();

      // 변형 규칙 로드
      this.ffish.loadVariantConfig(variantConfig);
      console.log('변형 규칙 로드 완료:', this.variantName);

      // 보드 생성
      this.board = new this.ffish.Board(this.variantName);

      this.ready = true;
      console.log('✅ Fairy-Stockfish 초기화 완료!');
      console.log('시작 FEN:', this.board.fen());

      return true;
    } catch (error) {
      console.error('❌ Fairy-Stockfish 초기화 실패:', error);
      return false;
    }
  }

  // 합법 수 목록 반환 (UCI 형식: "e2e4" 등)
  getLegalMoves() {
    if (!this.ready) return [];
    const movesString = this.board.legalMoves();
    return movesString ? movesString.split(' ') : [];
  }

  // 합법 수 목록을 좌표 형식으로 변환 [[row, col, toRow, toCol], ...]
  getLegalMovesAsCoords() {
    const moves = this.getLegalMoves();
    return moves.map(move => this.uciToCoords(move)).filter(m => m !== null);
  }

  // UCI 형식을 좌표로 변환 (예: "a1b2" -> [0, 0, 1, 1])
  uciToCoords(uci) {
    if (!uci || uci.length < 4) return null;

    const fromFile = uci.charCodeAt(0) - 'a'.charCodeAt(0); // a=0, b=1, ...
    const fromRank = parseInt(uci[1]) - 1; // 1=0, 2=1, ...
    const toFile = uci.charCodeAt(2) - 'a'.charCodeAt(0);
    const toRank = parseInt(uci[3]) - 1;

    return [fromRank, fromFile, toRank, toFile];
  }

  // 좌표를 UCI 형식으로 변환 (예: [0, 0, 1, 1] -> "a1b2")
  coordsToUci(fromRow, fromCol, toRow, toCol) {
    const fromFile = String.fromCharCode('a'.charCodeAt(0) + fromCol);
    const fromRank = (fromRow + 1).toString();
    const toFile = String.fromCharCode('a'.charCodeAt(0) + toCol);
    const toRank = (toRow + 1).toString();

    return fromFile + fromRank + toFile + toRank;
  }

  // 수 두기
  makeMove(fromRow, fromCol, toRow, toCol) {
    if (!this.ready) return false;

    const uci = this.coordsToUci(fromRow, fromCol, toRow, toCol);

    try {
      this.board.push(uci);
      console.log('수 실행:', uci, '| FEN:', this.board.fen());
      return true;
    } catch (error) {
      console.error('수 실행 실패:', uci, error);
      return false;
    }
  }

  // AI 최선의 수 계산
  getBestMove(depth = 12) {
    if (!this.ready) return null;

    const fen = this.board.fen();

    try {
      const bestMoveUci = this.ffish.getMove(fen, this.variantName, depth);

      if (!bestMoveUci) {
        console.warn('AI가 수를 찾지 못했습니다');
        return null;
      }

      console.log('AI 최선의 수 (UCI):', bestMoveUci);
      return this.uciToCoords(bestMoveUci);

    } catch (error) {
      console.error('AI 계산 실패:', error);
      return null;
    }
  }

  // 현재 보드 평가 점수
  getEvaluation() {
    if (!this.ready) return 0;

    try {
      const fen = this.board.fen();
      const evalString = this.ffish.getEval(fen, this.variantName);
      return parseFloat(evalString) || 0;
    } catch (error) {
      console.error('평가 실패:', error);
      return 0;
    }
  }

  // 게임 종료 여부
  isGameOver() {
    if (!this.ready) return false;
    return this.board.isGameOver();
  }

  // 게임 결과
  getResult() {
    if (!this.ready) return null;
    return this.board.result();
  }

  // 체크 상태 확인
  isCheck() {
    if (!this.ready) return false;
    return this.board.isCheck();
  }

  // 무르기
  undo() {
    if (!this.ready) return false;

    try {
      this.board.pop();
      return true;
    } catch (error) {
      console.error('무르기 실패:', error);
      return false;
    }
  }

  // 리셋
  reset() {
    if (!this.ready) return;
    this.board = new this.ffish.Board(this.variantName);
    console.log('보드 리셋');
  }

  // 현재 FEN
  getFen() {
    if (!this.ready) return '';
    return this.board.fen();
  }

  // FEN에서 보드 배열 추출 (6x6)
  getBoardArray() {
    if (!this.ready) return null;

    const fen = this.board.fen();
    const position = fen.split(' ')[0]; // FEN의 첫 부분만
    const ranks = position.split('/');

    const board = Array(6).fill().map(() => Array(6).fill(0));

    const pieceMap = {
      'p': -1, 'n': -2, 'b': -3, 'r': -4, 'l': -5, 'q': -6, 'k': -7, 'g': -8,
      'P': 1, 'N': 2, 'B': 3, 'R': 4, 'L': 5, 'Q': 6, 'K': 7, 'G': 8
    };

    // FEN은 8행(rank 8)부터 1행까지, 우리는 5행부터 0행까지
    for (let rank = 0; rank < 6; rank++) {
      let file = 0;
      const fenRank = ranks[5 - rank]; // FEN 순서 뒤집기

      for (let char of fenRank) {
        if (char >= '1' && char <= '6') {
          // 빈 칸
          file += parseInt(char);
        } else {
          // 기물
          board[rank][file] = pieceMap[char] || 0;
          file++;
        }
      }
    }

    return board;
  }

  // 특정 위치의 합법 수 목록 (UI용)
  getLegalMovesFrom(fromRow, fromCol) {
    const allMoves = this.getLegalMovesAsCoords();
    return allMoves
      .filter(([fr, fc]) => fr === fromRow && fc === fromCol)
      .map(([fr, fc, tr, tc]) => [tr, tc]);
  }
}

export default FairyEngine;
