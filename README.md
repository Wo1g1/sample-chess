# 6×6 변형 체스 (Variant Chess 6×6)

AI와 대결할 수 있는 6×6 변형 체스 게임입니다.

## 🎮 특징

- **커스텀 보드**: 6×6 크기
- **특수 기물**: Leaper (뛰어넘기 가능)
- **하이브리드 기물**: Bishop과 Rook에 추가 이동 능력
- **AI 대결**: Minimax 알고리즘 기반 AI
- **모듈화 구조**: 엔진과 UI 완전 분리

## 🎯 게임 규칙

### 기물 이동

| 기물 | 이동 방식 |
|------|-----------|
| **Pawn (P)** | 앞 1칸, 좌우 1칸, 대각선 앞 캡처 |
| **Knight (N)** | L자 (표준) |
| **Bishop (B)** | 대각선 최대 3칸 + 직선 1칸 |
| **Rook (R)** | 직선 최대 3칸 + 대각선 1칸 |
| **Leaper (L)** | 8방향 1칸 + 뛰어넘기 |
| **Queen (Q)** | 8방향 최대 3칸 |
| **King (K)** | 8방향 1칸 |
| **General (G)** | 8방향 1칸 (폰 승격 시) |

### Leaper 특수 규칙
- 기본적으로 8방향 1칸 이동
- **인접 칸에 기물이 있으면 (흑백 무관) 뛰어넘어 2칸 이동 가능**
- 도착 칸은 비어있거나 적 기물만 가능
- 인접 기물이 적이면 잡기 OR 뛰어넘기 선택 가능

### 승리 조건
- 체크메이트
- 스테일메이트 (무승부)
- 3회 반복 (무승부)
- 50수 룰 (무승부)

## 🚀 실행 방법

### 옵션 1: Vite 개발 서버 (권장)

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 http://localhost:5173 접속
```

### 옵션 2: 빌드 후 배포

```bash
# 프로덕션 빌드
npm run build

# 빌드 결과물은 dist/ 폴더에 생성
# dist/ 폴더를 웹 서버에 배포하거나 로컬 서버로 실행

# 미리보기
npm run preview
```

### 옵션 3: 기존 단일 HTML (레거시)

```bash
# 로컬 서버 실행
python3 -m http.server 8000

# 브라우저에서 http://localhost:8000/index.html 접속
```

## 📁 프로젝트 구조

```
sample-chess/
├── src/
│   ├── constants/          # 상수 정의
│   │   ├── pieces.js       # 기물 상수 (EMPTY, W_PAWN, etc.)
│   │   └── values.js       # 기물 가치 및 위치 보너스
│   ├── engine/             # 게임 엔진 로직
│   │   ├── boardUtils.js   # 보드 유틸리티 함수
│   │   ├── moveGeneration.js # 기물별 이동 수 생성
│   │   ├── gameLogic.js    # 게임 규칙 및 검증
│   │   ├── evaluation.js   # 평가 함수
│   │   └── ai.js           # AI 알고리즘 (Minimax + Alpha-Beta)
│   ├── ui/                 # UI 컴포넌트
│   │   └── ChessBoard.jsx  # 체스보드 렌더링
│   ├── App.jsx             # 메인 애플리케이션
│   └── main.jsx            # 엔트리 포인트
├── public/
│   └── index.html          # HTML 템플릿
├── package.json            # NPM 설정
├── vite.config.js          # Vite 빌드 설정
├── index.html              # 레거시 단일 파일 버전
└── README.md               # 이 파일
```

## 🔧 기술 스택

- **React 18**: UI 프레임워크
- **Vite**: 빌드 도구
- **TailwindCSS**: 스타일링
- **Vanilla JavaScript**: 게임 엔진 로직

## 🤖 AI 알고리즘

현재 구현:
- **Minimax** with **Alpha-Beta Pruning**
- **Move Ordering**: 캡처 우선 정렬
- **Depth**: 2 (약 1-2초 계산 시간)

평가 함수:
- 기물 가치
- 중앙 장악
- 이동성 (Mobility)
- 폰 진행도

## 🚧 향후 개선 계획

### Fairy-Stockfish 통합 (준비 완료!)
- 세계 최강급 AI (Stockfish 기반)
- Depth 12-15 탐색 가능
- NNUE 신경망 평가
- 자세한 내용은 `FAIRY_STOCKFISH_READY.md` 참조

### 최적화
- Piece-Square Tables
- Transposition Table
- Null-Move Pruning
- Web Worker로 AI 분리

## 📝 라이선스

GPL v3 - 자유롭게 사용, 수정, 배포 가능합니다.
단, 수정본도 GPL v3로 공개해야 합니다.

## 🎓 개발 히스토리

- v1.0: 단일 HTML 파일 버전
- v2.0: 모듈화 구조로 리팩토링
- v2.1 (예정): Fairy-Stockfish 통합

## 🐛 디버깅

브라우저 콘솔(F12)을 열면 AI 계산 과정을 확인할 수 있습니다:
- AI 차례 시작
- 계산 시간 (밀리초)
- 평가 점수와 선택된 수

## 🤝 기여

이슈와 PR을 환영합니다!

## 📧 연락처

GitHub: [Your GitHub URL]
