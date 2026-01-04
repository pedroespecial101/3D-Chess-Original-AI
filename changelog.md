# Changelog
I've updated the changelog to include the new zoom and debug settings.

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
