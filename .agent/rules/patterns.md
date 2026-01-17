# Architecture Patterns

This file documents the coding patterns used in this project. Follow these when adding new code.

---

## Hook Extraction Pattern

When Board.tsx or other large components have reusable logic, extract it to hooks in `src/hooks/`.

**When to extract:**
- Logic is reused across components
- A useEffect has significant logic (>15 lines)
- Logic can be tested independently

**Pattern:**
```typescript
// src/hooks/useExample.ts
export type UseExampleOptions = {
  // Options with JSDoc comments
}

export function useExample(options: UseExampleOptions) {
  // Hook logic here
}
```

**Existing hooks:**
- `useAiTurn` - AI move fetching and execution
- `useAiGameStart` - AI game initialization
- `useCameraControls` - Camera reset/focus/sync

---

## Component Extraction Pattern

When rendering logic becomes complex, extract to components in `src/components/`.

**Example: PieceRenderer**
Instead of:
```tsx
{piece.type === 'pawn' && <PawnModel {...props} />}
{piece.type === 'knight' && <KnightModel {...props} />}
{/* ... many more */}
```

Extract to:
```tsx
<PieceRenderer piece={piece} {...props} />
```

---

## Constants Pattern

Magic numbers should go in `src/constants/`.

**Example:**
```typescript
// src/constants/camera.ts
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [-12, 5, 6]
```

Then import and use:
```typescript
camera.position.set(...DEFAULT_CAMERA_POSITION)
```

---

## Shared Styles Pattern

Reusable Emotion styles go in `src/styles/shared.ts`.

**When to use:**
- Same style used in 2+ components
- Style represents a common pattern (button, section, label)

---

## Model Factory Pattern

Similar GLTF models use `SimpleGLTFModel.tsx` factory instead of duplicate files.

**For new standard piece models:**
```typescript
export const NewPieceModel = createSimpleGLTFModel({
  gltfPath: '/newpiece.gltf',
  geometryNodeKey: 'Object001XXX',
  scale: 0.9,
})
```
