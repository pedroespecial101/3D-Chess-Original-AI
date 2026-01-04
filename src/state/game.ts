import create from 'zustand'

import type { MovingTo } from '@/components/Board'
import type { Color } from '@/logic/pieces'
import { oppositeColor } from '@/logic/pieces'

export const useGameSettingsState = create<{
  gameType: `local` | `online`
  setGameType: (type: `local` | `online`) => void
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
  triggerCameraReset: () => set((state) => ({ cameraResetCounter: state.cameraResetCounter + 1 })),
}))
