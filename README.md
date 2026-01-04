Multiplayer 3d chess game built with react-three-fiber and socket.io.

Live demo: https://chess-in-3d.herokuapp.com/

![Imgur](https://i.imgur.com/r9tBfim.png)

---

## Adding New 3D Chess Pieces

This project supports custom 3D models (GLB format) as chess pieces. Follow this guide to integrate new models.

### Prerequisites
- A GLB model file (e.g., downloaded from Sketchfab or created in Blender)
- Node.js and npm installed

### Step 1: Convert GLB to React Component

Use `gltfjsx` to generate a React Three Fiber component from your GLB file:

```bash
npx gltfjsx@latest new_raw_assets/your-model/model.glb --transform --output src/models/YourPiece.tsx
```

**Flags:**
- `--transform`: Optimizes and compresses the GLB file (creates `model-transformed.glb`)
- `--output`: Specifies the output path for the generated React component

### Step 2: Copy Optimized Model to Public Folder

```bash
cp new_raw_assets/your-model/model-transformed.glb public/yourpiece.glb
```

### Step 3: Update the Generated Component

Edit the generated `src/models/YourPiece.tsx`:

```tsx
import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'
import { PieceMaterial, ModelProps } from './index'

// ... GLTFResult type definition ...

export const YourPieceModel: React.FC<ModelProps> = (props) => {
    const { nodes } = useGLTF('/yourpiece.glb') as unknown as GLTFResult
    const { color, isSelected, pieceIsBeingReplaced } = props
    const materialProps = { color, isSelected, pieceIsBeingReplaced }

    // Rotate white pieces to face opponents
    const yRotation = color === 'white' ? Math.PI : 0

    return (
        <group dispose={null} scale={180} rotation={[0, yRotation, 0]}>
            <mesh geometry={nodes.YourMesh.geometry}>
                <PieceMaterial {...materialProps} />
            </mesh>
            {/* Add more meshes as needed */}
        </group>
    )
}

useGLTF.preload('/yourpiece.glb')
```

**Key changes:**
1. Import `PieceMaterial` and `ModelProps` from `./index`
2. Replace any built-in materials with `<PieceMaterial {...materialProps} />`
3. Add `scale={180}` (adjust as needed) to compensate for MeshWrapper's 0.03 scale
4. Add rotation for white pieces if the model has a "front" direction

### Step 4: Wire Into a Piece Component

Edit the piece component you want to replace (e.g., `src/models/Pawn.tsx`):

```tsx
import { YourPieceModel } from './YourPiece'
import { MeshWrapper, type ModelProps } from './index'

export const YourPiece: React.FC<ModelProps> = (props) => {
    return (
        <MeshWrapper {...props} isFullModel>
            <YourPieceModel {...props} />
        </MeshWrapper>
    )
}
```

**Important:** Set `isFullModel={true}` on `MeshWrapper` to enable group-based animations.

### Troubleshooting

| Issue | Solution |
|-------|----------|
| Model invisible | Increase the `scale` value (try 150-250) |
| Model facing wrong direction | Add Y rotation: `rotation={[0, Math.PI, 0]}` |
| Wrong colors | Ensure you're using `<PieceMaterial>` not built-in materials |
| Model too large/small | Adjust the `scale` value |

### File Structure

```
public/
  └── yourpiece.glb          # Optimized GLB file
src/models/
  ├── YourPiece.tsx          # Your new piece component
  ├── index.tsx              # MeshWrapper and shared utilities
  └── Pawn.tsx               # Example usage in existing piece
new_raw_assets/
  └── your-model/            # Original source files (optional)
```
