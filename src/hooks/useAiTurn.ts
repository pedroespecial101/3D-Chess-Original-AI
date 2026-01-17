import { useEffect } from 'react'

import type { Board } from '@logic/board'
import type { Color, Move } from '@logic/pieces'
import { detectGameOver, movesForPiece } from '@logic/pieces'
import { toast } from 'react-toastify'

import type { MovingTo } from '@/components/Board'
import type { History } from '@/components/History'
import type { EngineConfig } from '@/state/ai'
import { aiClient, DEBUG } from '@/utils/aiClient'
import { fromChessNotation, historyToUciMoves } from '@/utils/chess'

export type UseAiTurnOptions = {
    /** Current game type */
    gameType: `local_ai` | `local` | `online`
    /** Current turn color */
    turn: Color
    /** Player's color */
    playerColor: Color
    /** Whether game has started */
    gameStarted: boolean
    /** Current board state */
    board: Board
    /** Move history */
    history: History[]
    /** AI engine configuration */
    currentConfig: EngineConfig
    /** Callback to set the moving piece */
    setMovingTo: (movingTo: MovingTo | null) => void
}

/**
 * Hook that handles AI turn logic.
 * When it's the AI's turn, fetches a move from the chess engine and triggers piece movement.
 */
export function useAiTurn(options: UseAiTurnOptions): void {
    const {
        gameType,
        turn,
        playerColor,
        gameStarted,
        board,
        history,
        currentConfig,
        setMovingTo,
    } = options

    useEffect(() => {
        // Only run for AI games when it's AI's turn
        if (gameType !== `local_ai` || turn === playerColor || !gameStarted) return

        // Don't move if game is over
        const gameOverType = detectGameOver(board, turn)
        if (gameOverType) return

        const makeAiMove = async () => {
            try {
                const uciMoves = historyToUciMoves(history)
                if (DEBUG) console.log(`AI Turn. History:`, uciMoves)

                const res = await aiClient.getMove(null, {
                    moves: uciMoves,
                    skillLevel: currentConfig.skillLevel,
                    depth: currentConfig.depth,
                    movetime: currentConfig.movetime,
                    eloRating: currentConfig.useElo ? currentConfig.eloRating : undefined,
                })

                if (DEBUG) console.log(`AI decided move:`, res)

                if (res.bestmove) {
                    const { from, to } = fromChessNotation(res.bestmove)
                    const fromTile = board[from.y][from.x]

                    if (fromTile?.piece) {
                        const legalMoves = movesForPiece({
                            piece: fromTile.piece,
                            board,
                            propagateDetectCheck: true,
                        })
                        const moveObj = legalMoves.find(
                            (m: Move) => m.newPosition.x === to.x && m.newPosition.y === to.y,
                        )
                        if (moveObj) {
                            setMovingTo({ move: moveObj, tile: fromTile })
                        } else {
                            console.warn(`AI suggested illegal move: ${res.bestmove}`)
                        }
                    }
                }
            } catch (e) {
                console.error(`AI Move Error`, e)
                toast.error(`AI failed to move`)
            }
        }

        makeAiMove()
    }, [turn, gameType, gameStarted, board, history, currentConfig, playerColor, setMovingTo])
}
