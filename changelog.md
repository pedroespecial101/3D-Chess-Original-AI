
# Changelog

## [Unreleased]

### Added
- Added AI Opponent integration using local UCI server.
- Added `ChessEngineClient` util in `src/utils/aiClient.ts` to communicate with Stockfish API.
- Added Skill Level Interface Pattern (SLIP) state management in `src/state/ai.ts` with presets (Learner, Beginner, Club, Expert, Grandmaster) and custom configuration.
- Added `AiSettings` component for configuring AI difficulty.
- Added `local_ai` game mode to `src/state/game.ts`.
- Added coordinate conversion utilities in `src/utils/chess.ts` for UCI generation.
- Updated `GameCreation` component to include tabs for "Online" and "Play vs AI".
- Updated `BoardComponent` to handle local AI game loop:
    - Moves are processed locally.
    - AI moves are fetched asynchronously from the API.
    - Added UI feedback for AI turns (implicit via move delay/animation).

### Changed
- Refactored `GameCreation.tsx` to slide between Online and AI setup forms.
