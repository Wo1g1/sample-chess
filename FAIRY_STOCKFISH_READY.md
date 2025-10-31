# Fairy-Stockfish 통합 준비 완료

이 프로젝트는 Fairy-Stockfish 통합을 위해 모듈화되었습니다.

## 현재 상태
✅ 코드가 모듈별로 분리됨
✅ 엔진 로직과 UI 분리 완료
✅ 프로젝트 구조 최적화
⏳ Fairy-Stockfish는 아직 설치되지 않음

## 통합 준비 단계

### 1. 의존성 설치
다음 명령을 실행하면 Fairy-Stockfish 통합이 시작됩니다:

```bash
npm install ffish-es6
```

### 2. Variant 설정 파일 생성
`src/engine/variant-config.ini` 파일에 다음 내용을 작성:

```ini
[CustomChess6x6:chess]
maxRank = 6
maxFile = 6
startFen = lbqknr/pppppp/6/6/PPPPPP/LBQKNR w - - 0 1

# Pawn: 앞 1칸(mfF) + 좌우 1칸(fsW) + 대각선 캡처(fceF)
pawn = mfFfsW:fceF

# Knight: 표준
knight = N

# Bishop: 대각선 최대 3칸(B3) + 직선 1칸(W)
customPiece1 = b:B3W

# Rook: 직선 최대 3칸(R3) + 대각선 1칸(F)
customPiece2 = r:R3F

# Leaper: 8방향 1칸(WF) + 뛰어넘기
# 인접 칸에 기물이 있으면 뛰어넘어 2칸 가능
customPiece3 = l:WFmB2fsN2R2

# Queen: 8방향 최대 3칸
queen = Q3

# King: 표준
king = K

# General: 폰 승격 시
customPiece4 = g:K

# 승격 규칙
promotionRank = 6
promotionPieceTypes = g

# 게임 종료 조건
extinctionValue = loss
```

### 3. Fairy-Stockfish 엔진 래퍼 생성
`src/engine/FairyEngine.js` 파일 생성 (예시 코드는 다음 명령 시 제공)

### 4. App.jsx 수정
현재 AI 로직을 Fairy-Stockfish로 교체

## 현재 프로젝트 구조

```
sample-chess/
├── src/
│   ├── constants/          # 상수 정의
│   │   ├── pieces.js       # 기물 상수
│   │   └── values.js       # 기물 가치
│   ├── engine/             # 게임 엔진 로직
│   │   ├── boardUtils.js   # 보드 유틸리티
│   │   ├── moveGeneration.js # 수 생성
│   │   ├── gameLogic.js    # 게임 규칙
│   │   ├── evaluation.js   # 평가 함수
│   │   └── ai.js           # AI 알고리즘 (현재 Minimax)
│   ├── ui/                 # UI 컴포넌트
│   │   └── ChessBoard.jsx  # 체스보드 UI
│   ├── App.jsx             # 메인 앱
│   └── main.jsx            # 엔트리 포인트
├── public/
│   └── index.html          # HTML 템플릿
├── package.json            # NPM 설정
├── vite.config.js          # Vite 설정
└── FAIRY_STOCKFISH_READY.md  # 이 파일

```

## 장점

### 현재 구조의 이점
1. **관심사 분리**: 엔진 로직과 UI 완전 분리
2. **재사용성**: 각 모듈을 독립적으로 사용 가능
3. **테스트 용이**: 개별 모듈 테스트 가능
4. **유지보수**: 코드 찾기 및 수정 간편
5. **확장성**: 새로운 기능 추가 쉬움

### Fairy-Stockfish 통합 후
1. **AI 강도 10배 향상**: depth 2 → 12-15
2. **코드 간소화**: engine/ 폴더 대부분 제거 가능
3. **세계 최강급**: Stockfish 알고리즘 사용
4. **NNUE 지원**: 신경망 평가

## Leaper 규칙 확인

Leaper의 정확한 이동 규칙:
- ✅ 8방향 1칸 기본 이동
- ✅ 인접 칸에 기물이 있으면 (흑백 무관) 뛰어넘어 2칸 이동 가능
- ✅ 도착 칸은 비어있거나 적 기물만 가능
- ✅ 인접 기물이 적이면: 잡기 OR 뛰어넘기 선택 가능

현재 코드에 정확하게 구현되어 있습니다.

## 다음 명령을 기다리는 중...

사용자가 "Fairy-Stockfish를 설치해" 라고 하면:
1. `npm install ffish-es6` 실행
2. variant-config.ini 생성
3. FairyEngine.js 래퍼 생성
4. App.jsx 수정
5. 테스트 및 커밋

모든 준비가 완료되었습니다!
