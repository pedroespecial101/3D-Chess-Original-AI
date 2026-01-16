import { create } from 'zustand'

import type { MovingTo } from '@/components/Board'
import type { Color } from '@/logic/pieces'
import { oppositeColor } from '@/logic/pieces'

export type IsolatedPiece = {
  type: `bishop` | `king` | `knight` | `pawn` | `queen` | `rook`
  color: Color
} | null

export type PieceRotation = {
  x: number
  y: number
  z: number
}

export type TextureMode = `hybrid` | `metallic` | `original`

export const useGameSettingsState = create<{
  gameType: `local_ai` | `local` | `online`
  setGameType: (type: `local_ai` | `local` | `online`) => void
  turn: Color
  setTurn: () => void
  resetTurn: () => void
  gameStarted: boolean
  setGameStarted: (started: boolean) => void
  movingTo: MovingTo | null
  setMovingTo: (move: MovingTo | null) => void
  minZoom: number
  setMinZoom: (zoom: number) => void
  maxZoom: number
  setMaxZoom: (zoom: number) => void
  showDebugSettings: boolean
  setShowDebugSettings: (show: boolean) => void
  enablePanning: boolean
  setEnablePanning: (enable: boolean) => void
  cameraResetCounter: number
  triggerCameraReset: () => void
  // Dev mode properties
  devMode: boolean
  setDevMode: (enabled: boolean) => void
  allowAnyColorMove: boolean
  setAllowAnyColorMove: (enabled: boolean) => void
  isolatedPiece: IsolatedPiece
  setIsolatedPiece: (piece: IsolatedPiece) => void
  freeMove: boolean
  setFreeMove: (enabled: boolean) => void
  verboseLogging: boolean
  setVerboseLogging: (enabled: boolean) => void
  animationSpeed: number
  setAnimationSpeed: (speed: number) => void
  animationPlaying: boolean
  setAnimationPlaying: (playing: boolean) => void
  animationLoop: boolean
  setAnimationLoop: (loop: boolean) => void
  pieceRotation: PieceRotation
  setPieceRotation: (rotation: PieceRotation) => void
  resetPieceRotation: () => void
  triggerBoardReset: () => void
  boardResetCounter: number
  // Texture mode for piece rendering
  textureMode: TextureMode
  setTextureMode: (mode: TextureMode) => void
}>((set) => ({
  gameType: `online`,
  setGameType: (type) => set({ gameType: type }),
  turn: `white`,
  setTurn: () => set((state) => ({ turn: oppositeColor(state.turn) })),
  resetTurn: () => set({ turn: `white` }),
  gameStarted: false,
  setGameStarted: (started: boolean) => set({ gameStarted: started }),
  movingTo: null,
  setMovingTo: (move: MovingTo | null) => set({ movingTo: move }),
  minZoom: 3,
  setMinZoom: (zoom: number) => set({ minZoom: zoom }),
  maxZoom: 25,
  setMaxZoom: (zoom: number) => set({ maxZoom: zoom }),
  showDebugSettings: false,
  setShowDebugSettings: (show: boolean) => set({ showDebugSettings: show }),
  enablePanning: false,
  setEnablePanning: (enable: boolean) => set({ enablePanning: enable }),
  cameraResetCounter: 0,
  triggerCameraReset: () =>
    set((state) => ({ cameraResetCounter: state.cameraResetCounter + 1 })),
  // Dev mode defaults
  devMode: false,
  setDevMode: (enabled: boolean) => set({ devMode: enabled }),
  allowAnyColorMove: true,
  setAllowAnyColorMove: (enabled: boolean) =>
    set({ allowAnyColorMove: enabled }),
  isolatedPiece: null,
  setIsolatedPiece: (piece: IsolatedPiece) => set({ isolatedPiece: piece }),
  freeMove: false,
  setFreeMove: (enabled: boolean) => set({ freeMove: enabled }),
  verboseLogging: false,
  setVerboseLogging: (enabled: boolean) => set({ verboseLogging: enabled }),
  animationSpeed: 1,
  setAnimationSpeed: (speed: number) => set({ animationSpeed: speed }),
  animationPlaying: true,
  setAnimationPlaying: (playing: boolean) => set({ animationPlaying: playing }),
  animationLoop: true,
  setAnimationLoop: (loop: boolean) => set({ animationLoop: loop }),
  pieceRotation: { x: 0, y: 0, z: 0 },
  setPieceRotation: (rotation: PieceRotation) =>
    set({ pieceRotation: rotation }),
  resetPieceRotation: () => set({ pieceRotation: { x: 0, y: 0, z: 0 } }),
  boardResetCounter: 0,
  triggerBoardReset: () =>
    set((state) => ({ boardResetCounter: state.boardResetCounter + 1 })),
  // Texture mode defaults
  textureMode: `hybrid`,
  setTextureMode: (mode: TextureMode) => set({ textureMode: mode }),
}))
