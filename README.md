# 🎯 Doctor Who 3D Chess

A Doctor Who themed 3D chess game built with React Three Fiber and Socket.io. Features iconic characters from the Doctor Who universe as chess pieces - the Doctor's allies as white pieces and classic villains as black pieces.

![Imgur](https://i.imgur.com/r9tBfim.png)

---

## 🔧 Based On

This project is forked from a multiplayer 3D chess game originally created with react-three-fiber and socket.io.

**Original Demo:** https://chess-in-3d.herokuapp.com/

---

## 🚀 Development Roadmap

### Stage 1: Character Integration ✅ (In Progress)
Replace all standard chess pieces with Doctor Who themed 3D models:

| Piece | White (Doctor's Allies) | Black (Enemies) |
|-------|------------------------|-----------------|
| Pawns | K-9 (Robot Dog) ✅ | Daleks ✅ |
| Rooks | TARDIS ✅ | Cybermen ✅ |
| Knights | TBD | TBD |
| Bishops | TBD | TBD |
| Queen | TBD | TBD |
| King | TBD | TBD |

### Stage 2: Basic Animation
Add animations to enhance the gameplay experience:
- Piece movement animations
- Capture animations
- Special move effects (castling, en passant, promotion)
- Idle animations for characters

### Stage 3: AI Opponent
Implement an AI chess engine for single-player mode:
- Basic chess AI implementation
- Difficulty levels
- Move suggestion system

---

## 🏗️ Architecture

### Technology Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 13** | React framework with server-side rendering |
| **React 18** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **React Three Fiber** | React renderer for Three.js |
| **@react-three/drei** | Useful helpers for R3F |
| **React Spring** | Physics-based animations |
| **Socket.io** | Real-time multiplayer communication |
| **Emotion** | CSS-in-JS styling |

### Project Structure

```
src/
├── components/          # React UI components
│   ├── Board.tsx        # Main chessboard component
│   ├── DebugSettings.tsx # Runtime debug configuration
│   └── ...
├── logic/               # Game logic
│   ├── chess.ts         # Chess rules and move validation
│   └── ...
├── models/              # 3D piece models
│   ├── index.tsx        # MeshWrapper and shared utilities
│   ├── Pawn.tsx         # Pawn piece (K-9 / Dalek)
│   ├── Rook.tsx         # Rook piece (TARDIS / Cyberman)
│   ├── K9.tsx           # K-9 robot dog model
│   ├── Dalek.tsx        # Dalek enemy model
│   ├── Tardis.tsx       # TARDIS model
│   ├── Cyberman.tsx     # Cyberman model
│   └── ...
├── pages/               # Next.js pages
├── server/              # Socket.io server logic
├── state/               # Game state management
├── styles/              # Global styles
└── utils/               # Utility functions

public/
├── k9.glb               # K-9 3D model
├── dalek.glb            # Dalek 3D model
├── tardis.glb           # TARDIS 3D model
├── cyberman.glb         # Cyberman 3D model
└── ...

new_raw_assets/          # Source 3D model files (before optimization)
```

### Key Components

- **MeshWrapper** (`src/models/index.tsx`): Wraps all pieces with animation capabilities, handles selection states and movement
- **PieceMaterial**: Shared material component that provides consistent styling and selection highlighting
- **BoardComponent**: Renders the 3D chessboard with OrbitControls for camera manipulation

---

## 🎮 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/3d-chess.git
cd 3d-chess

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the game.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## 🛠️ Adding New 3D Chess Pieces

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

---

## 📝 License

This project is private and for personal/educational use.

---

## 🙏 Credits

- Original 3D Chess project
- 3D Models from [Sketchfab](https://sketchfab.com/)
- Doctor Who is a trademark of the BBC
