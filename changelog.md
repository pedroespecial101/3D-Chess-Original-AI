# Changelog

## [2026-01-04]
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
