import { toast } from 'react-toastify'

import type { EngineConfig } from '@/state/ai'
import { useGameSettingsState } from '@/state/game'
import { usePlayerState } from '@/state/player'
import { aiClient } from '@/utils/aiClient'

export type UseAiGameStartOptions = {
  /** Current AI engine configuration */
  config: EngineConfig
  /** Optional: Enable debug mode after starting */
  enableDebugMode?: boolean
  /** Optional: Callback on successful start */
  onSuccess?: () => void
  /** Optional: Callback on failure */
  onError?: (error: unknown) => void
}

/**
 * Hook that provides an async function to start an AI game.
 * Consolidates the AI initialization logic used in both auto-start and manual start flows.
 *
 * @example
 * ```tsx
 * const { startAiGame, isStarting } = useAiGameStart({
 *   config: currentConfig,
 *   enableDebugMode: true,
 * })
 *
 * // Call when button clicked or auto-start triggered
 * await startAiGame()
 * ```
 */
export function useAiGameStart(options: UseAiGameStartOptions) {
  const { config, enableDebugMode = false, onSuccess, onError } = options

  const setGameType = useGameSettingsState((state) => state.setGameType)
  const setGameStarted = useGameSettingsState((state) => state.setGameStarted)
  const setDevMode = useGameSettingsState((state) => state.setDevMode)
  const setShowDebugSettings = useGameSettingsState(
    (state) => state.setShowDebugSettings,
  )
  const setJoinedRoom = usePlayerState((state) => state.setJoinedRoom)

  const startAiGame = async (): Promise<boolean> => {
    try {
      // Check health
      const isAlive = await aiClient.health()
      if (!isAlive) {
        const serverUrl = process.env.NEXT_PUBLIC_AI_SERVER_URL || `unknown`
        console.error(
          `[useAiGameStart] AI Server is not running on ${serverUrl}`,
        )
        toast.error(`AI Server is not running on ${serverUrl}`)
        return false
      }

      // Initialize engine
      await aiClient.init({
        skillLevel: config.skillLevel,
        eloRating: config.useElo ? config.eloRating : undefined,
        threads: config.threads,
        hash: config.hash,
      })

      // Enable debug mode if requested
      if (enableDebugMode) {
        setDevMode(true)
        setShowDebugSettings(true)
      }

      // Start the game
      setGameType(`local_ai`)
      setGameStarted(true)
      setJoinedRoom(true)

      console.log(`[useAiGameStart] AI game started successfully`)
      onSuccess?.()
      return true
    } catch (e) {
      console.error(`[useAiGameStart] Failed to start AI game:`, e)
      toast.error(`Failed to start AI game`)
      onError?.(e)
      return false
    }
  }

  return { startAiGame }
}
