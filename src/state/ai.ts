import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface EngineConfig {
  skillLevel: number
  depth: number
  movetime: number
  useElo: boolean
  eloRating?: number
  threads: number
  hash: number
}

export interface DifficultyPreset {
  id: string
  label: string
  description: string
  badge: `blue` | `green` | `red` | `yellow`
  config: EngineConfig
}

export const DEFAULT_PRESETS: DifficultyPreset[] = [
  {
    id: `learner`,
    label: `Just Learning`,
    description: `Minimal difficulty for learning the rules.`,
    badge: `green`,
    config: {
      skillLevel: 0,
      depth: 1,
      movetime: 500,
      useElo: false,
      threads: 1,
      hash: 64,
    },
  },
  {
    id: `beginner`,
    label: `Beginner`,
    description: `Basic play, makes occasional mistakes.`,
    badge: `green`,
    config: {
      skillLevel: 5,
      depth: 5,
      movetime: 1000,
      useElo: false,
      threads: 1,
      hash: 64,
    },
  },
  {
    id: `club`,
    label: `Club Player`,
    description: `Solid play, tactical.`,
    badge: `yellow`,
    config: {
      skillLevel: 10,
      depth: 10,
      movetime: 2000,
      useElo: true,
      eloRating: 1500,
      threads: 2,
      hash: 128,
    },
  },
  {
    id: `expert`,
    label: `Expert`,
    description: `Strong play, hard to beat.`,
    badge: `red`,
    config: {
      skillLevel: 15,
      depth: 15,
      movetime: 3000,
      useElo: true,
      eloRating: 2000,
      threads: 2,
      hash: 256,
    },
  },
  {
    id: `master`,
    label: `Grandmaster`,
    description: `Maximum strength. Good luck.`,
    badge: `red`,
    config: {
      skillLevel: 20,
      depth: 20,
      movetime: 5000,
      useElo: true,
      eloRating: 2800,
      threads: 4,
      hash: 512,
    },
  },
]

interface AiState {
  currentConfig: EngineConfig
  selectedPresetId: string
  userPresets: DifficultyPreset[]

  // Actions
  selectPreset: (id: string) => void
  updateConfig: (updates: Partial<EngineConfig>) => void
  saveUserPreset: (name: string) => void
  deleteUserPreset: (id: string) => void
}

export const useAiState = create<AiState>()(
  persist(
    (set, get) => ({
      currentConfig: DEFAULT_PRESETS[1].config, // Default to Beginner
      selectedPresetId: `beginner`,
      userPresets: [],

      selectPreset: (id) => {
        if (id === `custom`) {
          set({ selectedPresetId: `custom` })
          return
        }

        const presets = [...DEFAULT_PRESETS, ...get().userPresets]
        const preset = presets.find((p) => p.id === id)

        if (preset) {
          set({
            selectedPresetId: id,
            currentConfig: { ...preset.config },
          })
        }
      },

      updateConfig: (updates) => {
        set((state) => ({
          currentConfig: { ...state.currentConfig, ...updates },
          selectedPresetId: `custom`, // Auto-switch to custom on manual edit
        }))
      },

      saveUserPreset: (name) => {
        const newPreset: DifficultyPreset = {
          id: `user-${Date.now()}`,
          label: name,
          description: `Custom configuration`,
          badge: `blue`,
          config: { ...get().currentConfig },
        }

        set((state) => ({
          userPresets: [...state.userPresets, newPreset],
          selectedPresetId: newPreset.id,
        }))
      },

      deleteUserPreset: (id) => {
        set((state) => ({
          userPresets: state.userPresets.filter((p) => p.id !== id),
          selectedPresetId:
            state.selectedPresetId === id ? `custom` : state.selectedPresetId,
        }))
      },
    }),
    {
      name: `ai-settings-storage`,
    },
  ),
)
