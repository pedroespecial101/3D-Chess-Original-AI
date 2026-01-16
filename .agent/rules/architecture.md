# Architecture & State Rules

- **State Management**: Use Zustand stores in `src/state/`.
- **Logic Separation**: Keep chess rules and move validation in `src/logic/`. This logic should remain pure TypeScript and framework-agnostic.
- **3D Components**: Rendering and animations use React Three Fiber (R3F) and `react-spring`.

## Temporary Pieces (Knight, Bishop, Queen, King)

> **IMPORTANT**: These pieces are temporary placeholders until Doctor Who models are created.

- Files: `Knight.tsx`, `Bishop.tsx`, `Queen.tsx`, `King.tsx` in `src/models/`
- Export `*Model` components (e.g., `KnightModel`) following the full model pattern
- **Do NOT pass `originalMaterial`** to `PieceMaterial` - forces metallic mode for proper black/white coloring
- Scale: ~0.85-0.95 (NOT 180 like Doctor Who models)

When replacing with Doctor Who models:
1. **DO pass `originalMaterial`** - enables hybrid texture mode
2. Change scale from ~0.9 to ~180
3. Add rotation for white pieces: `rotation={[0, Math.PI, 0]}`

See README.md "Temporary Piece Implementation" section for full details.
