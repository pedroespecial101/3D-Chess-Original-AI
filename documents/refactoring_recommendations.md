# 🧹 Post-Merge Refactoring Recommendations

A comprehensive analysis of the 3D Chess codebase after merging the AI and models branches. Each item includes effort estimate and impact rating.

---

## 🚨 Priority 1: Remove Dead Code & Orphans

### 1.1 Delete Orphan File at Root
| Effort | Impact | Risk |
|--------|--------|------|
| ⚡ 5 min | High | None |

**Issue:** [K-9_Model.jsx](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/K-9_Model.jsx) exists at project root – a complete duplicate of the properly integrated `src/models/K9.tsx`.

**Action:** Delete `K-9_Model.jsx` from project root.

---

### 1.2 Remove Legacy Null Components
| Effort | Impact | Risk |
|--------|--------|------|
| ⚡ 10 min | Medium | Low |

**Issue:** Several model files export null components for "backward compatibility" that are never used:

```tsx
// src/models/Knight.tsx line 38
export const KnightComponent: FC = () => null

// src/models/Bishop.tsx line 38  
export const BishopComponent: FC = () => null

// src/models/Queen.tsx line 38
export const QueenComponent: FC = () => null
```

**Action:** Remove these dead exports after verifying no references exist.

---

## 🔄 Priority 2: Fix Type Duplications

### 2.1 Consolidate `EngineConfig` Type
| Effort | Impact | Risk |
|--------|--------|------|
| 🔧 20 min | High | Low |

**Issue:** `EngineConfig` is defined in two places:

1. [src/state/ai.ts](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/state/ai.ts#L4-12) – Full definition with `useElo` flag
2. [src/utils/aiClient.ts](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/utils/aiClient.ts#L1-8) – Subset without `useElo`

**Action:** Keep the fuller definition in `ai.ts` and import it in `aiClient.ts`. Consider creating a shared `types/` directory.

---

## 📦 Priority 3: Component Consolidation

### 3.1 Create Generic `SimpleGLTFModel` Component
| Effort | Impact | Risk |
|--------|--------|------|
| 🔧 45 min | High | Low |

**Issue:** Knight, Bishop, Queen, and King models are nearly identical (~40 lines each):

```diff
- // 4 separate files with identical structure
+ // Single reusable component
function SimpleGLTFModel({ 
  gltfPath, 
  geometryKey, 
  scale,
  ...props 
}: SimpleGLTFModelProps)
```

**Files affected:**
- [Knight.tsx](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/models/Knight.tsx)
- [Bishop.tsx](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/models/Bishop.tsx)
- [Queen.tsx](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/models/Queen.tsx)
- [King.tsx](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/models/King.tsx)

**Action:** Create factory function or generic component to reduce ~160 lines to ~40 lines.

---

### 3.2 Extract Piece Rendering Logic from Board.tsx
| Effort | Impact | Risk |
|--------|--------|------|
| ⏱️ 2-3 hours | Very High | Medium |

**Issue:** [Board.tsx](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/components/Board.tsx) is 562 lines and handles:
- Piece selection logic
- AI move handling  
- Board rendering
- Camera controls
- Move validation
- Dev mode features

**Proposed split:**

| New Component | Responsibility |
|--------------|----------------|
| `PieceRenderer.tsx` | Render pieces with correct models |
| `useAiTurn.ts` | AI turn logic (lines 134-180) |
| `useCamera.ts` | Camera reset and focus logic |
| `useMoveLogic.ts` | Selection and move validation |

---

## ⚙️ Priority 4: State Management

### 4.1 Split Game Settings Store
| Effort | Impact | Risk |
|--------|--------|------|
| ⏱️ 1-2 hours | High | Medium |

**Issue:** [game.ts](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/state/game.ts) (115 lines) mixes concerns:

```
Current store handles:
├── Core game state (turn, gameStarted, movingTo)
├── Camera settings (minZoom, maxZoom, enablePanning)  
├── Dev mode (devMode, allowAnyColorMove, verboseLogging)
├── Animation controls (animationSpeed, animationPlaying)
├── Piece isolation testing (isolatedPiece, pieceRotation)
└── Texture mode (textureMode)
```

**Proposed split:**

| Store | Contents |
|-------|----------|
| `gameStore.ts` | Core game state only |
| `cameraStore.ts` | Camera controls |
| `debugStore.ts` | All dev/debug features |

---

## 🔧 Priority 5: Eliminate Hardcoded Values

### 5.1 Move AI Server URL to Environment
| Effort | Impact | Risk |
|--------|--------|------|
| ⚡ 15 min | Medium | None |

**Issue:** Server URL hardcoded in multiple places:

```typescript
// src/utils/aiClient.ts:34
private baseUrl: string = 'http://192.168.1.187:3001'

// src/components/GameCreation.tsx:78, 124
toast.error('AI Server is not running on 192.168.1.187:3001')
```

**Action:** Use environment variable (e.g., `NEXT_PUBLIC_AI_SERVER_URL`).

---

### 5.2 Extract Magic Numbers to Constants
| Effort | Impact | Risk |
|--------|--------|------|
| 🔧 30 min | Medium | Low |

**Examples found:**

| File | Magic Number | Purpose |
|------|--------------|---------|
| Board.tsx:347 | `-12, 5, 6` | Default camera position |
| Board.tsx:513 | `3.5, 0.5, 3.5` | Board center |
| index.tsx:66 | `6.66` | FRAMER_MULTIPLIER |
| DebugSettings.tsx:455-456 | `3, 25` | Default zoom limits |

**Action:** Create `constants/camera.ts` and `constants/board.ts`.

---

## 🔁 Priority 6: DRY (Don't Repeat Yourself)

### 6.1 Consolidate AI Initialization Logic
| Effort | Impact | Risk |
|--------|--------|------|
| 🔧 30 min | Medium | Low |

**Issue:** AI engine initialization duplicated between:
- [GameCreation.tsx autoStartAiGame](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/components/GameCreation.tsx#L73-108) (auto-start)
- [GameCreation.tsx startAiGame](file:///Users/petetreadaway/Projects/DrWho-3DChess-Master/src/components/GameCreation.tsx#L119-144) (manual start)

**Action:** Extract to `useAiGameStart()` hook.

---

### 6.2 Create Shared CSS Style Module
| Effort | Impact | Risk |
|--------|--------|------|
| ⏱️ 1 hour | Medium | Low |

**Issue:** CSS-in-JS styles duplicated across components:

- `DebugSettings.tsx` defines `buttonStyle`, `sliderStyle`, `checkboxStyle` (lines 12-97)
- `AiSettings.tsx` defines similar styles (lines 9-108)
- `GameCreation.tsx` has inline duplicate styles

**Action:** Create `styles/shared.ts` with reusable Emotion styles.

---

## 🧪 Priority 7: Testing & Quality

### 7.1 Add Essential Unit Tests
| Effort | Impact | Risk |
|--------|--------|------|
| ⏱️ 2-4 hours | Very High | None |

**Missing test coverage for:**
- Chess logic in `src/logic/pieces/` (7 files)
- Board state management
- AI client communication

**Note:** No test files found in current project.

---

## 🗂️ Priority 8: Project Structure

### 8.1 Organize Public Assets
| Effort | Impact | Risk |
|--------|--------|------|
| 🔧 20 min | Low | Low |

**Issue:** Mixed GLTF and GLB files in `/public`:
- Original chess pieces: `knight.gltf`, `bishop.gltf`, etc.
- Doctor Who models: `dalek.glb`, `k9.glb`, `cyberman.glb`, `tardis.glb`

**Suggestion:** Organize into `/public/models/standard/` and `/public/models/doctorwho/`.

---

### 8.2 Create Barrel Exports
| Effort | Impact | Risk |
|--------|--------|------|
| 🔧 30 min | Low | None |

**Suggestion:** Add `index.ts` files to:
- `src/components/`
- `src/state/`
- `src/utils/`

Simplifies imports: `import { Board, DebugSettings } from '@/components'`

---

## 🚀 Priority 9: Performance

### 9.1 Memoize Model Components
| Effort | Impact | Risk |
|--------|--------|------|
| 🔧 30 min | Medium | Low |

**Issue:** Model components re-render on every board update.

**Action:** Wrap model components with `React.memo()` and use stable prop references.

---

### 9.2 Lazy Load Doctor Who Models
| Effort | Impact | Risk |
|--------|--------|------|
| 🔧 45 min | Medium | Low |

**Suggestion:** Since Doctor Who models aren't fully integrated yet:
- Use `React.lazy()` for themed model components
- Preload only when theme is selected

---

## 📋 Summary: Quick Wins vs Deep Refactors

### ⚡ Quick Wins (< 30 min each)
1. Delete orphan `K-9_Model.jsx`
2. Remove legacy null components
3. Consolidate `EngineConfig` type
4. Move AI server URL to env var

### 🔧 Medium Effort (30 min - 2 hours)
5. Create `SimpleGLTFModel` factory
6. Extract AI initialization hook
7. Create shared CSS module
8. Extract magic numbers to constants

### ⏱️ Deep Refactors (2+ hours)
9. Split `Board.tsx` into smaller components
10. Split game settings store
11. Add unit test coverage

---

> **Recommendation:** Start with Quick Wins to clean up merge artifacts, then tackle Medium Effort items to reduce duplication before attempting Deep Refactors.
