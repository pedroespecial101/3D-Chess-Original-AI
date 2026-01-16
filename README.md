# 3D Chess Application

This `README.md` is designed to provide a comprehensive overview of the project's architecture, features, and integration details for future AI agents and developers.

## 1. Project Overview

This is a modern 3D Chess application built with React, Next.js, and React Three Fiber (R3F). It supports both **Online Multiplayer** (via Socket.io) and **Local AI** gameplay (via a custom UCI-compatible server interface).

The project aims to provide a premium visual experience with 3D models while maintaining robust chess logic and adhering to standard chess protocols for AI integration.

## 2. Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (React)
*   **3D Rendering**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) & [Drei](https://github.com/pmndrs/drei)
*   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
*   **Styling**: Vanilla CSS / Emotion (minimal)
*   **Real-time Communication**: [Socket.io Client](https://socket.io/)
*   **Backend Interface**: Custom `aiClient` communicating with a local Express/Stockfish server.

## 3. Project Structure

### `src/components`
UI and 3D components.
*   `Board.tsx`: The core game component. Handles rendering the 3D board, piece movement animations, and game loop integration (including AI turns).
*   `GameCreation.tsx`: UI for setting up new games (Online vs AI).
*   `StatusBar.tsx`: Displays current turn, game status, and opponent info.
*   `models/`: Contains 3D GLTF/GLB models for chess pieces (King, Queen, Pawn, etc.).

### `src/logic`
Pure TypeScript game logic (Framework agnostic).
*   `board.ts`: Board representation (8x8 grid of Tiles), initialization, and utility functions.
*   `pieces/`: Individual logic for each piece type (movement rules, validation).
    *   `index.ts`: Central export, `movesForPiece`, `check/checkmate` detection.
    *   `pawn.ts`, `king.ts`, etc.: Specific move generation.

### `src/state`
Global state management using Zustand.
*   `game.ts`: Game settings (`gameType`, `turn`, game started state).
*   `ai.ts`: AI specific settings (Skill Level, Difficulty Presets, Engine configuration).
*   `history.ts`: Logs moves for history display and AI synchronization.
*   `player.ts`: User identity and room state for multiplayer.

### `src/utils`
Helper functions.
*   `aiClient.ts`: **CRITICAL**. The interface for communicating with the external chess engine server. Handles `init`, `move`, and `quit` commands.
*   `chess.ts`: Helpers for converting between internal board coordinates and UCI notation (e.g., `e2e4`).
*   `socket.ts`: Socket.io connection setup.

## 4. Key Features & Implementation Details

### Game Modes
1.  **Online**: Players create a room and play against a human opponent via WebSockets.
2.  **Local AI**: Player plays against a Stockfish engine running on a local server.
    *   The `Board.tsx` component `useEffect` detects when it is the AI's turn.
    *   It sends the full move history to the engine via `aiClient`.
    *   Returns a move in UCI notation, which is converted to an internal move object and executed.

### AI Integration (Skill Level Interface Pattern - SLIP)
The AI system is designed with a "Skill Level Interface Pattern".
-   **Configuration**: managed in `src/state/ai.ts`.
-   **Presets**: `learner`, `beginner`, `club`, `expert`, `master`.
-   **Communication**: The app expects a local server running at `http://192.168.1.187:3001` (default).
-   **Debug**: Enable `DEBUG` in `src/utils/aiClient.ts` to see detailed logs of engine communication in the browser console.

**See `documents/AI_API_Integration_Guide.md` for full API details.**

### 3D Move Handling
*   Pieces are independent 3D meshes.
*   Movement is animated using `react-spring` (implied by `animated.pointLight` usage and general R3F patterns).
*   State updates happen *after* visual confirmation or are synchronized.

## 5. Development Workflow

### Running the App
```bash
npm run dev
# Runs on localhost:3000
```

### Running the AI Backend
This project **requires** the separate AI Server project to be running for 'Play vs AI' to work.
*   Ensure the external Chess Engine Server is running on port `3001`.
*   Endpoint checks: `GET http://192.168.1.187:3001/health`.

### Common Tasks for AI Agents
*   **Adding a new piece**: Add model to `src/models`, logic to `src/logic/pieces`, and update `src/logic/pieces/index.ts`.
*   **Modifying AI Logic**: Check `src/components/Board.tsx` (turn handling) and `src/utils/aiClient.ts` (API payload).
*   **Styling**: Most 3D styling is in `Board.tsx` (lights, controls) and individual model components. UI styling is in component-specific CSS/TSX.

## 6. Troubleshooting

*   **AI moves same piece as player**: Typically happens if the move history isn't sent correctly to the engine, causing it to think it's the opening move for White. (Fixed in recent updates).
*   **Connection Refused**: Check if the local AI server is running.
*   **Illegal Moves**: `src/logic` handles validation. If AI returns an illegal move, it logs a warning in the console.

---
*Generated for AI Context - January 2026*
