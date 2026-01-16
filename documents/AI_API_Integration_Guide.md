# UCI Chess Engine API Integration Guide

> **Intended Audience:** This document is designed for AI systems to understand and integrate with the UCI Chess Engine API for playing chess games.

## Table of Contents

1. [Connection Setup](#connection-setup)
2. [API Base URL](#api-base-url)
3. [Quick Start Workflow](#quick-start-workflow)
4. [API Endpoints Reference](#api-endpoints-reference)
5. [Request/Response Formats](#requestresponse-formats)
6. [Position Formats](#position-formats)
7. [Error Handling](#error-handling)
8. [Best Practices](#best-practices)
9. [Example Integration](#example-integration)

---

## Connection Setup

The API is a REST API using HTTP with JSON payloads. No authentication is currently required.

### Prerequisites
- The server must be running (default port: 3001)
- Stockfish engine must be installed
- Network access to the server

### Headers
All POST requests must include:
```
Content-Type: application/json
```

---

## API Base URL

**Default:** `http://192.168.1.187:3001`

**Production:** Update based on deployment location

---

## Quick Start Workflow

To start a chess game against the engine:

1. **Check Server Health** → `GET /health`
2. **Initialize Engine** → `POST /api/engine/init`
3. **Get Moves** → `POST /api/engine/move`
4. **Cleanup** → `DELETE /api/engine/quit` (when done)

---

## API Endpoints Reference

### 1. Health Check

**Endpoint:** `GET /health`

**Purpose:** Verify server and engine binary availability

**Request:** None

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-16T10:20:49.000Z",
  "engine": {
    "binaryPath": "/absolute/path/to/stockfish",
    "binaryExists": true,
    "initialized": false,
    "ready": false,
    "searching": false,
    "engineType": null
  }
}
```

**Use Case:** Call before initializing to ensure the engine binary exists

---

### 2. Initialize Engine

**Endpoint:** `POST /api/engine/init`

**Purpose:** Start and configure the chess engine

**Request Body (all optional):**
```json
{
  "enginePath": "./engines/stockfish",
  "engineType": "stockfish",
  "skillLevel": 10,
  "eloRating": 1500,
  "threads": 4,
  "hash": 256
}
```

**Parameters:**
- `enginePath` (string): Path to engine binary
- `engineType` (string): Engine type - currently only `"stockfish"` supported
- `skillLevel` (number): 0-20, where 0 is weakest and 20 is full strength
- `eloRating` (number): 1320-3190, sets UCI_LimitStrength mode
- `threads` (number): Number of CPU threads for analysis
- `hash` (number): Hash table size in MB

**Response (success):**
```json
{
  "status": "initialized",
  "engineType": "stockfish",
  "options": {
    "skillLevel": 10,
    "eloRating": 1500,
    "threads": 4,
    "hash": 256
  }
}
```

**Response (already initialized):**
```json
{
  "status": "already_initialized"
}
```

**Important Notes:**
- Calling init multiple times with the same configuration returns "already_initialized"
- Calling init with different configuration will quit the existing engine and reinitialize
- Either use `skillLevel` OR `eloRating`, not both (eloRating takes precedence)
- Engine must be initialized before calling move/analyze endpoints

---

### 3. Get Best Move

**Endpoint:** `POST /api/engine/move`

**Purpose:** Request the best move for a given position

**Request Body (all optional):**

**Option A - Using FEN position:**
```json
{
  "position": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  "depth": 15,
  "movetime": 2000
}
```

**Option B - Using move sequence from starting position:**
```json
{
  "moves": ["e2e4", "e7e5", "g1f3"],
  "depth": 15,
  "movetime": 2000
}
```

**Option C - Starting position (empty request):**
```json
{}
```

**Parameters:**
- `position` (string): FEN string representing the board position
- `moves` (array of strings): UCI move notation from starting position (e.g., `["e2e4", "e7e5"]`)
- `depth` (number): Search depth in plies (half-moves)
- `movetime` (number): Search time in milliseconds
- `skillLevel` (number): Override the init skill level for this specific move
- `eloRating` (number): Override the init ELO rating for this specific move

**Response:**
```json
{
  "bestmove": "b8c6",
  "ponder": "f1b5",
  "evaluation": {
    "type": "cp",
    "value": -30,
    "depth": 15,
    "nodes": 1234567,
    "time": 1500,
    "pv": ["b8c6", "f1b5", "g8f6", "b1c3"]
  }
}
```

**Response Fields:**
- `bestmove` (string): Best move in UCI notation (e.g., "e2e4", "e7e5q" for promotion)
- `ponder` (string, optional): Suggested opponent response for pondering
- `evaluation` (object): Position evaluation details
  - `type` (string): "cp" (centipawns) or "mate"
  - `value` (number): Evaluation score (positive = white advantage, negative = black advantage)
  - `depth` (number): Actual search depth achieved
  - `nodes` (number): Total nodes searched
  - `time` (number): Time spent in milliseconds
  - `pv` (array): Principal variation (best line of play)

**Move Format:** UCI notation
- Regular move: `e2e4` (from square + to square)
- Pawn promotion: `e7e8q` (append piece: q/r/b/n)
- Castling: `e1g1` (king moves two squares)

---

### 4. Analyze Position

**Endpoint:** `POST /api/engine/analyze`

**Purpose:** Get deep analysis of a position (similar to move but typically with greater depth)

**Request Body:**
```json
{
  "position": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
  "depth": 20,
  "movetime": 5000
}
```

**Parameters:**
- `position` (string): FEN string
- `moves` (array): UCI moves from starting position  
- `depth` (number): Default 20 if not specified
- `movetime` (number): Analysis time in milliseconds

**Response:** Same format as `/api/engine/move`

**Difference from /move:**
- Typically uses deeper search (depth 20 by default vs no default for move)
- Intended for detailed position analysis rather than quick move generation
- Future: Will support streaming analysis updates via WebSocket (not yet implemented)

---

### 5. Get Engine Status

**Endpoint:** `GET /api/engine/status`

**Purpose:** Check current engine state

**Request:** None

**Response (uninitialized):**
```json
{
  "initialized": false,
  "ready": false,
  "searching": false,
  "engineType": null
}
```

**Response (initialized and ready):**
```json
{
  "initialized": true,
  "ready": true,
  "searching": false,
  "engineType": "stockfish",
  "queueLength": 0
}
```

**Fields:**
- `initialized` (boolean): Whether engine has been initialized
- `ready` (boolean): Whether engine is ready for commands
- `searching` (boolean): Whether engine is currently analyzing
- `engineType` (string): Type of engine ("stockfish" or null)
- `queueLength` (number): Number of queued commands

---

### 6. Stop Analysis

**Endpoint:** `POST /api/engine/stop`

**Purpose:** Interrupt current analysis/search

**Request:** Empty body `{}`

**Response:**
```json
{
  "status": "stopped"
}
```

**Use Case:** Stop a long-running analysis to submit a new request

---

### 7. Quit Engine

**Endpoint:** `DELETE /api/engine/quit`

**Purpose:** Gracefully shut down the engine

**Request:** None

**Response:**
```json
{
  "status": "shutdown"
}
```

**Important:** After quitting, you must call `/api/engine/init` again before making move/analyze requests

---

## Request/Response Formats

### Position Formats

#### FEN (Forsyth–Edwards Notation)
Complete board state in a single string:
```
rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1
```

Components:
1. Piece placement (rank 8 to rank 1)
2. Active color (w/b)
3. Castling availability (KQkq or -)
4. En passant target square
5. Halfmove clock
6. Fullmove number

#### UCI Move Notation
Format: `[from_square][to_square][promotion_piece]`

Examples:
- `e2e4` - Pawn from e2 to e4
- `e1g1` - Castling kingside (white)
- `e7e8q` - Pawn promotion to queen
- `a7a8n` - Pawn promotion to knight

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `400` - Bad request (e.g., engine not initialized)
- `404` - Endpoint not found
- `500` - Internal server error
- `503` - Service unavailable (e.g., engine binary not found)

### Error Response Format
```json
{
  "error": "Error message description",
  "status": 400
}
```

### Common Errors

**1. Engine Not Initialized**
```
Status: 400
Error: "Engine not initialized. Call /api/engine/init first."
```
**Solution:** Call `POST /api/engine/init` before making move requests

**2. Invalid Engine Path**
```
Status: 503
Error: "Failed to start engine"
```
**Solution:** Verify engine binary exists at specified path

**3. Invalid Position**
```
Status: 400
Error: "Invalid position"
```
**Solution:** Verify FEN string is properly formatted or moves are legal

---

## Best Practices

### 1. Initialization
```javascript
// Initialize once at the start of the game
await fetch('http://192.168.1.187:3001/api/engine/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    skillLevel: 10,  // Adjust difficulty as needed
    threads: 2,
    hash: 128
  })
});
```

### 2. Move Management
Maintain game state in one of two ways:

**Option A - Track moves array:**
```javascript
const moves = [];
// After each move, add to array
moves.push('e2e4');
moves.push('e7e5');

// Request next move
const response = await fetch('http://192.168.1.187:3001/api/engine/move', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ moves, depth: 15 })
});
```

**Option B - Use FEN position:**
```javascript
// Use a chess library to manage board state and generate FEN
const fen = currentBoardState.fen();

const response = await fetch('http://192.168.1.187:3001/api/engine/move', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ position: fen, depth: 15 })
});
```

### 3. Difficulty Control

**For consistent difficulty (recommended):**
```javascript
// Set once during init
await fetch('http://192.168.1.187:3001/api/engine/init', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ eloRating: 1500 })
});
```

**For dynamic difficulty:**
```javascript
// Override per move
await fetch('http://192.168.1.187:3001/api/engine/move', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    moves: currentMoves,
    skillLevel: calculateDifficulty(),  // 0-20
    depth: 15
  })
});
```

### 4. Search Parameters

Balance between speed and strength:

**Fast moves (1-2 seconds):**
```json
{
  "moves": ["e2e4"],
  "depth": 10,
  "movetime": 1000
}
```

**Strong moves (5+ seconds):**
```json
{
  "moves": ["e2e4"],
  "depth": 20,
  "movetime": 5000
}
```

**Note:** Both `depth` and `movetime` can be specified; engine will stop when either limit is reached.

### 5. Cleanup
```javascript
// When game is complete or user exits
await fetch('http://192.168.1.187:3001/api/engine/quit', {
  method: 'DELETE'
});
```

### 6. Error Recovery
```javascript
async function getEngineMove(position) {
  try {
    const response = await fetch('http://192.168.1.187:3001/api/engine/move', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position, depth: 15 })
    });
    
    if (response.status === 400) {
      // Likely not initialized - initialize and retry
      await fetch('http://192.168.1.187:3001/api/engine/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillLevel: 10 })
      });
      
      // Retry
      return await getEngineMove(position);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Engine error:', error);
    throw error;
  }
}
```

---

## Example Integration

### Complete Game Flow

```javascript
class ChessEngineClient {
  constructor(baseUrl = 'http://192.168.1.187:3001') {
    this.baseUrl = baseUrl;
    this.moves = [];
  }
  
  async init(options = {}) {
    const response = await fetch(`${this.baseUrl}/api/engine/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        skillLevel: options.skillLevel || 10,
        threads: options.threads || 2,
        hash: options.hash || 128
      })
    });
    
    return await response.json();
  }
  
  async getMove(userMove = null) {
    // Add user's move if provided
    if (userMove) {
      this.moves.push(userMove);
    }
    
    const response = await fetch(`${this.baseUrl}/api/engine/move`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        moves: this.moves,
        depth: 15,
        movetime: 2000
      })
    });
    
    const result = await response.json();
    
    // Add engine's move to history
    if (result.bestmove) {
      this.moves.push(result.bestmove);
    }
    
    return result;
  }
  
  async analyze(position) {
    const response = await fetch(`${this.baseUrl}/api/engine/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        position,
        depth: 20
      })
    });
    
    return await response.json();
  }
  
  async quit() {
    const response = await fetch(`${this.baseUrl}/api/engine/quit`, {
      method: 'DELETE'
    });
    
    return await response.json();
  }
}

// Usage Example
async function playGame() {
  const engine = new ChessEngineClient();
  
  // 1. Initialize
  await engine.init({ skillLevel: 10 });
  
  // 2. User plays e2-e4
  const move1 = await engine.getMove('e2e4');
  console.log('Engine responds:', move1.bestmove);
  console.log('Evaluation:', move1.evaluation);
  
  // 3. User plays another move
  const move2 = await engine.getMove('g1f3');
  console.log('Engine responds:', move2.bestmove);
  
  // 4. Get deep analysis of current position
  const analysis = await engine.analyze();
  console.log('Analysis:', analysis);
  
  // 5. Cleanup when done
  await engine.quit();
}
```

### Quick Reference

```javascript
// Health check
GET /health

// Initialize engine
POST /api/engine/init
{
  "skillLevel": 10,
  "eloRating": 1500,
  "threads": 2,
  "hash": 128
}

// Get move (moves array)
POST /api/engine/move
{
  "moves": ["e2e4", "e7e5"],
  "depth": 15
}

// Get move (FEN position)
POST /api/engine/move
{
  "position": "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1",
  "depth": 15
}

// Analyze position
POST /api/engine/analyze
{
  "position": "...",
  "depth": 20
}

// Check status
GET /api/engine/status

// Stop analysis
POST /api/engine/stop

// Shutdown
DELETE /api/engine/quit
```

---

## Additional Information

### Skills and Ratings

**Skill Level (0-20):**
- 0-5: Beginner (makes obvious mistakes)
- 6-10: Intermediate (casual player)
- 11-15: Advanced (club player)
- 16-20: Expert to Master level

**ELO Rating (1320-3190):**
- 1320-1600: Beginner
- 1600-1800: Intermediate
- 1800-2200: Advanced
- 2200-2800: Master level
- 2800+: Super GM level

### Performance Tuning

**threads:** More threads = faster analysis (diminishing returns after 4-8 threads)

**hash:** Larger hash table = better performance on deep searches (typical: 64-512 MB)

**depth vs movetime:**
- Use `depth` for consistent analysis quality
- Use `movetime` for time-limited scenarios
- Use both to set maximum limits on either parameter

---

## Troubleshooting

### Engine not responding
1. Check `/health` endpoint
2. Verify `binaryExists: true`
3. Call `/api/engine/init`
4. Check `/api/engine/status` shows `initialized: true`

### Slow responses
1. Reduce `depth` parameter (try 10-12 instead of 20)
2. Add `movetime` limit (e.g., 2000ms)
3. Reduce `threads` if CPU-constrained
4. Reduce `hash` if memory-constrained

### Invalid move errors
1. Verify FEN string format
2. Ensure moves are in UCI notation
3. Check moves are legal from the current position
4. Use a chess validation library (e.g., chess.js) to validate moves

---

## Summary

This API provides a simple REST interface to a UCI chess engine. The typical workflow is:

1. **Initialize** the engine with desired difficulty settings
2. **Send positions** (either as FEN or move sequences) to get best moves
3. **Process responses** containing moves in UCI notation and position evaluations
4. **Cleanup** when done to free resources

The API is stateless except for the engine initialization. You can maintain the game state on the client side and send the current position with each request.
