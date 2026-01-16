# AI Opponent & UCI Integration Rules

- **Engine Communication**: All communication with the chess engine must go through `src/utils/aiClient.ts`.
- **API Endpoint**: The AI engine server is expected to be running on `http://localhost:3001`.
- **Stateless AI Implementation**: The frontend manages the game state. When requesting a move from the AI, you **MUST** send the full `moves` array (history) to the engine. Failure to do so will cause the engine to assume it is the first turn.
- **UCI Notation**: Coordinate conversion between the internal {x, y} system and UCI notation (e.g., "e2e4") should be handled using utilities in `src/utils/chess.ts`.
- **Turn Handling**: AI turns are handled reactively in `src/components/Board.tsx` via `useEffect`. Ensure that `playerColor` is correctly referenced to avoid the AI playing for the human side.
