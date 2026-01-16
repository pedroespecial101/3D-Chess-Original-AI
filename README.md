# 🎯 Doctor Who 3D Chess

A Doctor Who themed 3D chess game built with React Three Fiber and Socket.io. Features iconic characters from the Doctor Who universe as chess pieces - the Doctor's allies as white pieces and classic villains as black pieces.

**This README is designed for AI coding agents to understand the codebase.**

![Imgur](https://i.imgur.com/r9tBfim.png)

---

## 📋 Quick Reference

| Mode | Description |
|------|-------------|
| **Online** | Multiplayer via Socket.io rooms |
| **Play vs AI** | Local AI opponent using UCI engine |
| **Debug Mode** | Development features for testing |

### URL Parameters

| Parameter | Example | Description |
|-----------|---------|-------------|
| `mode=debug` | `http://localhost:3010?mode=debug` | Auto-starts AI game with debug panel enabled |

> [!TIP]
> **For AI Agents**: Use `?mode=debug` to skip the startup UI and go directly into an AI game with debug enabled.

## 🏗️ Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js** | React framework |
| **React Three Fiber** | React renderer for Three.js |
| **@react-three/drei** | R3F helpers (OrbitControls, useGLTF) |
| **React Spring** | Physics-based animations |
| **Socket.io** | Real-time multiplayer |
| **Zustand** | State management |
| **Emotion** | CSS-in-JS styling |

---

## 📁 Project Structure

```
src/
├── components/           # React UI components
│   ├── Board.tsx         # Core 3D game component (AI turns, debug features)
│   ├── GameCreation.tsx  # Game setup UI (Online/AI tabs, Debug toggle)
│   ├── DebugSettings.tsx # Runtime debug panel
│   ├── AiSettings.tsx    # AI difficulty configuration
│   └── ...
├── logic/                # Pure chess logic (framework agnostic)
│   ├── board.ts          # Board representation, tile utilities
│   └── pieces/           # Move generation per piece type
├── models/               # 3D piece components
│   ├── index.tsx         # MeshWrapper, PieceMaterial (shared utilities)
│   ├── Pawn.tsx          # K-9 (white) / Dalek (black)
│   ├── Rook.tsx          # TARDIS (white) / Cyberman (black)
│   ├── K9.tsx, Dalek.tsx, Tardis.tsx, Cyberman.tsx
│   └── ...
├── state/                # Zustand stores
│   ├── game.ts           # Turn, gameType, debug settings
│   ├── ai.ts             # AI config and difficulty presets
│   ├── history.ts        # Move history
│   └── player.ts         # User identity, room info
├── utils/
│   ├── aiClient.ts       # UCI engine API client
│   ├── chess.ts          # UCI notation converters
│   └── socket.ts         # Socket.io setup
└── pages/
    └── index.tsx         # Main game page

public/
├── k9.glb, dalek.glb, tardis.glb, cyberman.glb  # 3D models
└── ...
```

---

## 🎮 Game Modes

### Online Multiplayer
- Players join rooms via Socket.io
- Real-time move synchronization
- Camera position sharing between players

### Play vs AI
- Uses external UCI-compatible chess engine
- **Server**: `http://192.168.1.187:3001` (configurable in `aiClient.ts`)
- Engine configured via SLIP (Skill Level Interface Pattern)
- Presets: Learner, Beginner, Club, Expert, Grandmaster

### Debug Mode
- Toggle on game creation screen
- Features: piece isolation, camera controls, verbose logging
- Dev mode overrides only work in PVP, not AI games

---

## 🧠 AI Integration

### Architecture
```
Browser (Board.tsx) → aiClient.ts → UCI Server (192.168.1.187:3001) → Stockfish
```

### Key Files
- `src/utils/aiClient.ts` - HTTP client for engine communication
- `src/state/ai.ts` - Difficulty presets and config storage
- `src/utils/chess.ts` - UCI notation conversion (`e2e4` format)
- `src/components/Board.tsx` - AI turn detection (lines 117-153)

### API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Server status check |
| POST | `/api/engine/init` | Initialize engine with config |
| POST | `/api/engine/move` | Get best move for position |
| DELETE | `/api/engine/quit` | Shutdown engine |

### AI Turn Flow
1. `Board.tsx` detects `gameType === 'local_ai'` and `turn !== playerColor`
2. Converts move history to UCI format via `historyToUciMoves()`
3. Calls `aiClient.getMove()` with history and config
4. Parses returned move (`e2e4`) to internal format
5. Executes move via `setMovingTo()`

---

## 🔧 Key Components

### Board.tsx
- Renders 3D board and all pieces
- Handles both online and AI game loops
- Camera controls (OrbitControls with debug zoom/pan)
- Piece selection, move validation, animation triggers

### MeshWrapper (src/models/index.tsx)
- Wraps all chess pieces
- Applies 0.03 scale (custom models need 100-200x compensation)
- Handles selection states, movement animation
- `isFullModel` prop for GLB-based pieces

### PieceMaterial
- Shared material with texture mode support
- Three modes: `metallic`, `original`, `hybrid`
- Selection highlighting (color change on select)

---

## 🎭 Doctor Who Pieces

| Piece | White (Allies) | Black (Enemies) | Status |
|-------|----------------|-----------------|--------|
| Pawns | K-9 (Robot Dog) | Daleks | ✅ Done |
| Rooks | TARDIS | Cybermen | ✅ Done |
| Knights | *Standard (temp)* | *Standard (temp)* | ⏳ Pending DW model |
| Bishops | *Standard (temp)* | *Standard (temp)* | ⏳ Pending DW model |
| Queen | *Standard (temp)* | *Standard (temp)* | ⏳ Pending DW model |
| King | *Standard (temp)* | *Standard (temp)* | ⏳ Pending DW model |

---

## 📐 Temporary Piece Implementation (Knight, Bishop, Queen, King)

Until Doctor Who themed models are created, standard chess pieces from GLTF files are used as placeholders. This section documents the implementation for future replacement.

> [!IMPORTANT]
> **Temporary pieces use METALLIC mode, not hybrid mode.** Do NOT pass `originalMaterial` to `PieceMaterial` - this forces metallic mode which gives proper white/silver and black/dark coloring. If you pass `originalMaterial`, the pieces will appear red/colored incorrectly.

### Problem Solved
The original piece components (`KnightComponent`, `BishopComponent`, etc.) used an outdated pattern that tried to attach raw geometry to the parent `MeshWrapper` mesh. This broke when we switched to the "full model" pattern for Doctor Who pieces.

### Solution: Full Model Pattern
All pieces now use the **full model pattern** - each component exports a `*Model` component (e.g., `KnightModel`) that returns a complete `<group>` containing `<mesh>` elements with geometry and `PieceMaterial`.

```tsx
// Example from Knight.tsx - NOTE: NO originalMaterial passed!
export const KnightModel: FC<ModelProps> = (props) => {
  const { nodes } = useGLTF(`/knight.gltf`) as unknown as GLTFResult
  const { color, isSelected, pieceIsBeingReplaced } = props
  const materialProps = { color, isSelected, pieceIsBeingReplaced }

  return (
    <group dispose={null} scale={0.95}>
      <mesh geometry={nodes.Object001005.geometry}>
        {/* NO originalMaterial = forces metallic mode = correct black/white colors */}
        <PieceMaterial {...materialProps} />
      </mesh>
    </group>
  )
}
```

### When Replacing with Doctor Who Models

When new Doctor Who models are ready:
1. **DO pass `originalMaterial`** - DW models should use hybrid mode for their textures
2. **Change scale** from ~0.9 to ~180 (matching Dalek/K9/etc)
3. **Add rotation** for white pieces: `rotation={[0, Math.PI, 0]}`

### Board.tsx Changes
In `Board.tsx`, all pieces now use `isFullModel={true}`:
```tsx
const isFullModel = true  // All pieces now use full model pattern
```

---

## 📏 Scale Reference Guide

### Understanding the Scale System

The `MeshWrapper` component applies a base scale of **0.03** internally. All piece models must compensate for this.

| Model Type | Raw GLTF Scale | Compensating Scale | Effective Size | Notes |
|------------|----------------|-------------------|----------------|-------|
| **Dalek** | ~0.005 | `180` | 5.4 units | Large Doctor Who model |
| **K-9** | ~0.005 | `180` | 5.4 units | Same as Dalek |
| **TARDIS** | ~0.005 | `180` | 5.4 units | Same as Dalek |
| **Cyberman** | ~0.005 | `180` | 5.4 units | Same as Dalek |
| **Knight** | ~0.025 | `0.95` | ~0.03 units | Standard GLTF piece |
| **Bishop** | ~0.025 | `0.90` | ~0.03 units | Standard GLTF piece |
| **Queen** | ~0.025 | `0.85` | ~0.03 units | Standard GLTF piece |
| **King** | ~0.025 | `0.85` | ~0.03 units | Standard GLTF piece |

### Why Different Scales?

1. **Doctor Who models** (Dalek, K9, etc.) are exported at a very small scale from Blender, requiring large 180x compensation
2. **Standard GLTF pieces** (knight.gltf, etc.) are at ~0.025 scale in their files, needing only ~0.85-0.95x adjustment
3. The **MeshWrapper's 0.03 scale** is the common denominator all models work against

### Formula for New Doctor Who Models

When adding new Doctor Who models, start with `scale={180}` and adjust:
- If piece is too small → increase scale
- If piece is too large → decrease scale
- Target: piece should fit within one board tile with appropriate height proportions

### Files to Update When Replacing Temporary Pieces

When Doctor Who models are ready for Knight/Bishop/Queen/King:

1. `src/models/Knight.tsx` → Replace `KnightModel` internals
2. `src/models/Bishop.tsx` → Replace `BishopModel` internals  
3. `src/models/Queen.tsx` → Replace `QueenModel` internals
4. `src/models/King.tsx` → Replace `KingModel` internals
5. Update scale from ~0.9 to ~180 (matching other DW models)
6. Add white piece rotation: `rotation={[0, Math.PI, 0]}`
7. Copy new GLB files to `public/`

### GLTF Node/Material Key Pattern

Standard GLTF pieces follow this naming pattern:
- **Knight**: `nodes.Object001005`, `materials['Object001_mtl.005']`
- **Bishop**: `nodes.Object001002`, `materials['Object001_mtl.002']`
- **Queen**: `nodes.Object001003`, `materials['Object001_mtl.003']`
- **King**: `nodes.Object001004`, `materials['Object001_mtl.004']`

Use `npx gltfjsx@latest model.glb --output /tmp/check.tsx` to inspect any GLTF file structure.

## 🚀 Getting Started

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server (default port 3000)
npm run dev

# Or specify port
npm run dev -- -p 3010
```

### For AI Mode
The external UCI chess server must be running on `192.168.1.187:3001`.

---

## 🛠️ Adding New 3D Pieces

1. **Convert GLB to React component:**
   ```bash
   npx gltfjsx@latest model.glb --transform --output src/models/NewPiece.tsx
   ```

2. **Copy optimized model to public:**
   ```bash
   cp model-transformed.glb public/newpiece.glb
   ```

3. **Update component:**
   - Import `PieceMaterial`, `ModelProps` from `./index`
   - Replace materials with `<PieceMaterial {...materialProps} />`
   - Add `scale={180}` to compensate for MeshWrapper
   - Add rotation for white pieces: `rotation={[0, Math.PI, 0]}`

4. **Wire into piece component:**
   ```tsx
   <MeshWrapper {...props} isFullModel>
     <NewPieceModel {...props} />
   </MeshWrapper>
   ```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| AI not responding | Check server at `192.168.1.187:3001/health` |
| AI plays wrong color | Ensure move history is being sent |
| Model invisible | Increase `scale` value (try 150-200) |
| Debug mode not working | Check "Enable Debug Mode" on game creation |

---

## 📜 Agent Rules

See `.agent/rules/` for coding guidelines:
- `documentation.md` - Changelog and README requirements
- `ai_integration.md` - AI opponent interaction rules
- `architecture.md` - Code structure conventions
- `debugging.md` - Debug logging requirements

---

## 📝 Credits

- Original 3D Chess project
- 3D Models from [Sketchfab](https://sketchfab.com/)
- Doctor Who is a trademark of the BBC
