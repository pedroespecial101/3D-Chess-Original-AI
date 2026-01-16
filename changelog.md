# Changelog

** Read README.md for AI coding agent focused project overview and documentation. **
** Follow the AI coding agent rules in .agent/rules/ **

## [2026-01-16] - Fixed Missing Chess Pieces (Knight, Bishop, Queen, King)

### Fixed
- Restored Knight, Bishop, Queen, and King pieces that were not rendering on the board
- Converted these components to "full model" pattern (matching Dalek/K9/Tardis/Cyberman structure)
- Fixed React infinite loop in IsolationMiniBoard by adding `useShallow` to Zustand selector

### Changed
- Changed default TextureMode from `metallic` to `hybrid` - blends original textures with metallic properties
- All piece types now use `isFullModel={true}` in Board.tsx for consistent rendering

### Technical Details
The standard chess pieces (Knight, Bishop, Queen, King) were using an outdated component pattern that tried to attach geometry directly. They've been refactored to export `*Model` components (e.g., `KnightModel`) that return complete `<mesh>` elements with geometry and materials, matching the Doctor Who themed pieces. These are temporary placeholders until Doctor Who models are added.

---

## [2026-01-16] - Fixed React Infinite Loop Error

### Fixed
- Fixed "Maximum update depth exceeded" React error on startup caused by incorrect Zustand state selector usage
- Added `useShallow` wrapper to `useAiState` selector in `Board.tsx` (line 97)
- Added `useShallow` wrapper to dev mode state selector in `Board.tsx` (line 113)  
- Added `useShallow` wrapper to `useGameSettingsState` selector in `DebugSettings.tsx` (line 131)

### Technical Details
Zustand selectors that return new objects (e.g., `(state) => ({ key: state.key })`) create new references on every render, triggering infinite re-render loops. Using `useShallow` performs a shallow comparison of object keys to prevent unnecessary re-renders.

---

## [2026-01-16] - Merged AI + Models Branches

### Added
- **Debug Mode Toggle**: New checkbox on game creation screen enables debug mode for both Online and AI games
- Combined AI opponent functionality with Doctor Who themed 3D models

### Changed
- Merged AI branch (opponent functionality) with models branch (custom GLB models, debug panel)
- `Board.tsx`: Combined AI turn logic with debug panel camera controls and piece isolation
- `GameCreation.tsx`: Added Debug Mode checkbox, kept tab UI for Online/AI modes
- `index.tsx`: Merged state selectors for both features
- Dev mode overrides (allowAnyColorMove) only apply in PVP debug mode, not AI games
- Camera sync disabled for local AI games (no remote player to sync with)

### Fixed
- Fixed `HistoryItem` type import in `chess.ts` (changed to `History` from correct module)
- Fixed ESLint accessibility modifiers in `aiClient.ts`
- Fixed union type sorting in `IsolationMiniBoard.tsx`

---

## [2026-01-16] - AI Opponent Integration

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

---

## [2026-01-16] - Texture Mode Switching

### Added
- **Texture Mode Toggle**: Three rendering modes for chess pieces accessible via Debug Settings panel
  - **Metallic**: Original uniform chrome/metallic appearance (default)
  - **Original**: Uses the actual textures embedded in GLB model files
  - **Hybrid**: Blends original textures with metallic properties (clearcoat, high metalness)
- Added `textureMode` setting to game state store
- Added `originalMaterial` prop support to `PieceMaterial` component
- Updated model components (Dalek, Tardis, K9, Cyberman) to pass original materials through

### Changed
- Refactored `PieceMaterial` in `src/models/index.tsx` to support all three texture modes
- Enhanced `DebugSettings.tsx` with new "Texture Mode" section and toggle buttons

---

## [2026-01-10]
### Fixed
- Started the development server for the 3D chess project.
- Verified game accessibility and themed pieces via browser subagent.

## [2026-01-05] - Development Mode Features
### Added
- **Quick Join (Dev) button**: Bypasses login screen, joins "dev" room instantly, and enables dev mode
- **Development Mode**: Master toggle that enables all dev features when joined via Quick Join
- **Move Any Color toggle**: Allows moving both white and black pieces in the same session
- **Free Move toggle**: Placeholder for moving pieces anywhere (ignoring legal moves)
- **Piece Isolation Mode**: Click on mini chessboard to isolate a specific piece type
  - Shows only the selected piece type/color on the board
  - Centers isolated piece for easier viewing
  - Camera auto-focuses on isolated piece
- **Piece Rotation Controls**: 3-axis rotation sliders for isolated pieces (X, Y, Z)
- **Animation Controls** (shown in isolation mode):
  - Play/Pause button
  - Step forward button
  - Speed slider (0.1x - 2x)
  - Loop toggle
- **Verbose Logging toggle**: Enables detailed console logging for piece selection and moves
- **Reset Board button**: Resets the game board to starting position
- Created `IsolationMiniBoard.tsx` component with clickable 2D chessboard

### Changed
- Completely redesigned `DebugSettings.tsx` with organized sections and improved styling
- Enhanced `Board.tsx` with dev mode state and piece isolation logic
- Updated `GameCreation.tsx` with Quick Join button and dev mode handling
- Expanded `game.ts` state with all new dev mode properties

---

## [2026-01-05]
### Changed
- Thoroughly updated `README.md` with comprehensive project documentation:
  - Added project purpose: Doctor Who themed 3D chess game
  - Documented the development roadmap (3 stages: Character Integration, Animation, AI)
  - Added architecture section with technology stack and project structure
  - Included character mapping table (white = Doctor's allies, black = enemies)
  - Added getting started guide and available scripts
  - Noted the project this is based upon
- Started the development server.

## [2026-01-04]
### Added
- Created a new `DebugSettings` component for runtime configuration.
- Added a "Debug" toggle button to the main UI.
- Introduced `minZoom`, `maxZoom`, `enablePanning`, and `showDebugSettings` to the global game state.
- Added a "Reset Camera" button to the debug panel.
- Added "Enable Panning" toggle to the debug panel (enables right-click dragging).

### Changed
- Increased maximum zoom level (allowing closer inspection of characters).
- Connected `BoardComponent`'s `OrbitControls` to dynamic zoom limits from the state.
- Updated `BoardComponent` to support manual camera reset and right-click panning.

---

## [2026-01-04]
### Added
- Integrated Cyberman model for black side rooks.
- Added `Cyberman.tsx` component with SkinnedMesh support and metallic materials.

### Changed
- Updated `Rook.tsx` to render Cyberman for black rooks (Tardis for white, Cyberman for black).

---

## [2026-01-04]
### Added
- Integrated TARDIS (William Hartnell era) model for white side rooks.
- Added `Tardis.tsx` component with optimized asset loading and metallic materials.
- Extended side-specific model pattern: white rooks use TARDIS, black rooks use standard model.

### Changed
- Updated `Board.tsx` to set `isFullModel={true}` for white rooks.
- Updated `Rook.tsx` to conditionally render models based on piece color.

---

## [2026-01-04]
### Added
- Integrated K-9 (Doctor Who's robot dog) model for white side pawns.
- Added `K9.tsx` component with optimized asset loading and metallic materials.
- Established side-specific model pattern: white pawns use K-9, black pawns use Daleks.

### Changed
- Refactored `Pawn.tsx` to conditionally render models based on piece color.
- K-9 scale set to 180 to match other pieces.

---

## [2026-01-04] (Earlier)
### Added
- Integrated Dalek pawn models into the 3D chess board as replacement pawns.
- Added `isFullModel` support to `MeshWrapper` to allow complex 3D models alongside standard pieces.
- Added `Dalek.tsx` component with optimized asset loading and metallic materials.
- Added documentation for integrating new 3D pieces from GLB files (see README.md).

### Changed
- Refactored `src/models/index.tsx` to support both `mesh` and `group` based components for animations.
- Updated `Pawn.tsx` to use the new `DalekModel`.
- Modified `Board.tsx` to pass correct props for full model rendering.
- Dalek scale adjusted to 180 for optimal proportions relative to other pieces.

### Fixed
- Fixed a regression where standard pieces would disappear when using a `group` as the primary animation container.
- Fixed invisible Dalek pawns by adding compensating scale to overcome the 0.03 downscaling in `MeshWrapper`.
- Fixed white Dalek orientation: added 180° Y rotation so their plungers face opponents instead of their own side.

---

## Technical Notes: Adding New 3D Pieces

### Process Overview
When integrating custom 3D models (GLB files) as chess pieces, the following workflow was used:

1. **Convert GLB to React Component** using `gltfjsx`:
   ```bash
   npx gltfjsx@latest path/to/model.glb --transform --output src/models/NewPiece.tsx
   ```
   The `--transform` flag optimizes the GLB file (reduces size, compresses textures).

2. **Copy optimized GLB to public folder**:
   ```bash
   cp path/to/model-transformed.glb public/newpiece.glb
   ```

3. **Update the generated component**:
   - Import `PieceMaterial` and `ModelProps` from `./index`
   - Replace built-in materials with `<PieceMaterial {...materialProps} />`
   - Add compensating `scale` prop to the outer group (typically 100-200x)
   - Add color-based rotation if needed (e.g., `rotation={[0, color === 'white' ? Math.PI : 0, 0]}`)

4. **Wire into the piece component** (e.g., `Pawn.tsx`):
   - Import the new model component
   - Set `isFullModel={true}` on `MeshWrapper`
   - Return the model as children

### Scale Compensation
The `MeshWrapper` component applies `scale={0.03}` internally. Custom models need a compensating scale factor (e.g., `scale={180}`) to appear at the correct size.
