
# Changelog
** Read README.md for AI coding agent focused project overview and documentation. **
** Follow the AI coding agent rules in .agent/rules/ **
## [Unreleased]

### Changed
- Updated AI Engine connection to use server IP `192.168.1.187:3001` instead of `localhost`.

### Fixed
- Fixed AI-moved pieces disappearing after completing their move. The bug was in `finishMovingPiece` using the source tile position instead of the destination (`movingTo.move.newPosition`).

### Changed
- Split `.agent/rules.md` into granular rule files in `.agent/rules/`: `documentation.md`, `ai_integration.md`, `architecture.md`, and `debugging.md`.

### Added
- Created `.agent/rules.md` to enforce documentation standards and AI integration patterns (moved from `.cursorrules`).
- Added project-specific rules regarding the external UCI AI engine interface.
- Added DEBUG logging to `aiClient` and `Board` component to track AI decision making.
- Added `DEBUG` flag in `aiClient.ts`.

### Fixed
- Fixed AI playing as White (human side) by ensuring move history is sent to the chess engine.

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
