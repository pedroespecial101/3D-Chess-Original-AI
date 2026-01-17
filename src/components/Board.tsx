import type { FC } from 'react'
import React, { useEffect, useState, useRef } from 'react'

import type { Position, Tile, Board } from '@logic/board'
import { checkIfPositionsMatch, copyBoard } from '@logic/board'
import type { Move, Piece } from '@logic/pieces'
import {
  createId,
  getTile,
  detectGameOver,
  oppositeColor,
  shouldPromotePawn,
  checkIfSelectedPieceCanMoveHere,
  movesForPiece,
} from '@logic/pieces'
import { isPawn } from '@logic/pieces/pawn'
import type { ModelProps } from '@models/index'
import { MeshWrapper } from '@models/index'
import { TileComponent } from '@models/Tile'
import { useSpring, animated } from '@react-spring/three'
import { OrbitControls } from '@react-three/drei'
import { toast } from 'react-toastify'
import { useShallow } from 'zustand/react/shallow'

import { PieceRenderer } from '@/components/PieceRenderer'

import { useAiTurn } from '@/hooks/useAiTurn'
import { useCameraControls } from '@/hooks/useCameraControls'
import { isKing } from '@/logic/pieces/king'
import { isRook } from '@/logic/pieces/rook'
import type { GameOver } from '@/pages/index'
import { useAiState } from '@/state/ai'
import { useGameSettingsState } from '@/state/game'
import { useHistoryState } from '@/state/history'
import { usePlayerState } from '@/state/player'
import { DEBUG } from '@/utils/aiClient'
import { isDev } from '@/utils/isDev'
import { useSocketState } from '@/utils/socket'

type ThreeMouseEvent = {
  stopPropagation: () => void
}

export type MovingTo = {
  move: Move
  tile: Tile
}
export type MakeMoveClient = {
  movingTo: MovingTo
  room: string
}

export const BoardComponent: FC<{
  selected: Piece | null
  setSelected: (piece: Piece | null) => void
  board: Board
  setBoard: React.Dispatch<React.SetStateAction<Board>>
  moves: Move[]
  setGameOver: (gameOver: GameOver | null) => void
  setMoves: (moves: Move[]) => void
}> = ({
  selected,
  setSelected,
  board,
  setBoard,
  moves,
  setMoves,
  setGameOver,
}) => {
    const [lastSelected, setLastSelected] = useState<Tile | null>(null)
    const [history, setHistory] = useHistoryState(
      useShallow((state) => [state.history, state.addItem]),
    )
    const { playerColor, room } = usePlayerState(
      useShallow((state) => ({
        playerColor: state.playerColor,
        room: state.room,
      })),
    )
    const [turn, setTurn, gameStarted, movingTo, setMovingTo, gameType] =
      useGameSettingsState(
        useShallow((state) => [
          state.turn,
          state.setTurn,
          state.gameStarted,
          state.movingTo,
          state.setMovingTo,
          state.gameType,
        ]),
      )
    const socket = useSocketState((state) => state.socket)
    const { currentConfig } = useAiState(
      useShallow((state) => ({ currentConfig: state.currentConfig })),
    )

    // Dev mode state - for debug panel features
    const {
      devMode,
      allowAnyColorMove,
      isolatedPiece,
      verboseLogging,
      pieceRotation,
      boardResetCounter,
      minZoom,
      maxZoom,
      enablePanning,
      cameraResetCounter,
    } = useGameSettingsState(
      useShallow((state) => ({
        devMode: state.devMode,
        allowAnyColorMove: state.allowAnyColorMove,
        isolatedPiece: state.isolatedPiece,
        verboseLogging: state.verboseLogging,
        pieceRotation: state.pieceRotation,
        boardResetCounter: state.boardResetCounter,
        minZoom: state.minZoom,
        maxZoom: state.maxZoom,
        enablePanning: state.enablePanning,
        cameraResetCounter: state.cameraResetCounter,
      })),
    )

    const [redLightPosition, setRedLightPosition] = useState<Position>({
      x: 0,
      y: 0,
    })

    // AI Turn Logic (extracted to hook)
    useAiTurn({
      gameType,
      turn,
      playerColor,
      gameStarted,
      board,
      history,
      currentConfig,
      setMovingTo,
    })

    const selectThisPiece = (e: ThreeMouseEvent, tile: Tile | null) => {
      e.stopPropagation()
      // Dev mode overrides (only for PVP debug, not AI mode)
      const canMoveAnyColor =
        devMode && allowAnyColorMove && gameType !== `local_ai`
      const isPlayersTurn =
        turn === playerColor ||
        isDev ||
        canMoveAnyColor ||
        (gameType === `local_ai` && turn === playerColor)
      if (!isPlayersTurn || !gameStarted) return
      if (!tile?.piece?.type && !selected) return
      if (!tile?.piece) {
        setSelected(null)
        return
      }

      // In dev mode (PVP), allow selecting any piece regardless of color
      if (!canMoveAnyColor && tile.piece.color !== turn) {
        if (verboseLogging) {
          console.log(
            `[Dev] Blocked: Not your turn to move`,
            tile.piece.color,
            `pieces`,
          )
        }
        return
      }

      setMovingTo(null)
      const pieceMoves = movesForPiece({
        piece: tile.piece,
        board,
        propagateDetectCheck: true,
      })

      if (verboseLogging) {
        console.log(`[Dev] Selected piece:`, tile.piece.type, tile.piece.color)
        console.log(`[Dev] Available moves:`, pieceMoves.length)
        pieceMoves.forEach((m, i) =>
          console.log(`  [${i}]`, m.newPosition, m.type),
        )
      }

      setMoves(pieceMoves)
      setSelected(tile.piece)
      setLastSelected(tile)
      setRedLightPosition(tile.position)
    }

    const finishMovingPiece = (tile: Tile | null) => {
      if (!tile || !movingTo) return // Removed socket check for local AI mode
      const newHistoryItem = {
        board: copyBoard(board),
        to: movingTo.move.newPosition,
        from: movingTo.move.piece.position,
        steps: movingTo.move.steps,
        capture: movingTo.move.capture,
        type: movingTo.move.type,
        piece: movingTo.move.piece,
      }
      setHistory(newHistoryItem)
      setBoard((prev) => {
        const newBoard = copyBoard(prev)
        if (!movingTo.move.piece) return prev
        const selectedTile = getTile(newBoard, movingTo.move.piece.position)
        const tileToMoveTo = getTile(newBoard, movingTo.move.newPosition)
        if (!selectedTile || !tileToMoveTo) return prev

        if (
          isPawn(selectedTile.piece) ||
          isKing(selectedTile.piece) ||
          isRook(selectedTile.piece)
        ) {
          selectedTile.piece = { ...selectedTile.piece, hasMoved: true }
        }
        if (isPawn(selectedTile.piece) && shouldPromotePawn({ tile })) {
          selectedTile.piece.type = `queen`
          selectedTile.piece.id = selectedTile.piece.id + 1
        }

        if (
          isPawn(selectedTile.piece) &&
          movingTo.move.type === `captureEnPassant`
        ) {
          const latestMove = history[history.length - 1]
          const enPassantTile = newBoard[latestMove.to.y][latestMove.to.x]
          enPassantTile.piece = null
        }

        if (movingTo.move.castling) {
          const rookTile =
            newBoard[movingTo.move.castling.rook.position.y][
            movingTo.move.castling.rook.position.x
            ]
          const rookTileToMoveTo =
            newBoard[movingTo.move.castling.rookNewPosition.y][
            movingTo.move.castling.rookNewPosition.x
            ]
          if (!isRook(rookTile.piece)) return prev

          rookTileToMoveTo.piece = {
            ...rookTile.piece,
            hasMoved: true,
            position: rookTileToMoveTo.position,
          }
          rookTile.piece = null
        }

        tileToMoveTo.piece = selectedTile.piece
          ? { ...selectedTile.piece, position: movingTo.move.newPosition }
          : null
        selectedTile.piece = null
        return newBoard
      })

      setTurn()

      setMovingTo(null)
      setMoves([])
      setSelected(null)
      setLastSelected(null)
    }

    useEffect(() => {
      const gameOverType = detectGameOver(board, turn)
      if (gameOverType) {
        setGameOver({ type: gameOverType, winner: oppositeColor(turn) })
      }
    }, [board, turn])

    const startMovingPiece = (
      e: ThreeMouseEvent | null,
      tile: Tile,
      nextTile: Move,
    ) => {
      e?.stopPropagation()
      const newMovingTo: MovingTo = {
        move: nextTile,
        tile: tile,
      }

      if (gameType === `local_ai`) {
        // Local AI mode: directly set movingTo
        setMovingTo(newMovingTo)
      } else if (socket) {
        // Online mode: emit to socket
        const makeMove: MakeMoveClient = {
          movingTo: newMovingTo,
          room: room,
        }
        socket.emit(`makeMove`, makeMove)
      }
    }

    const { intensity } = useSpring({
      intensity: selected ? 0.35 : 0,
    })

    const controlsRef = useRef<any>(null)

    // Camera controls (extracted to hook)
    const { handleCameraChange } = useCameraControls({
      controlsRef,
      cameraResetCounter,
      isolatedPiece,
      verboseLogging,
      gameType,
      socket,
      room,
      playerColor,
      devMode,
    })

    // Handle board reset logging
    useEffect(() => {
      if (boardResetCounter > 0) {
        if (verboseLogging) {
          console.log(`[Dev] Board reset triggered`)
        }
      }
    }, [boardResetCounter, verboseLogging])

    // Helper to check if piece should be shown (for isolation mode)
    const shouldShowPiece = (piece: Piece | null) => {
      if (!isolatedPiece || !piece) return true
      return (
        piece.type === isolatedPiece.type && piece.color === isolatedPiece.color
      )
    }

    return (
      <group position={[-3.5, -0.5, -3.5]}>
        <OrbitControls
          ref={controlsRef}
          maxDistance={devMode ? Infinity : maxZoom}
          minDistance={devMode ? 0 : minZoom}
          enableZoom={true}
          enablePan={devMode ? true : enablePanning}
          onEnd={handleCameraChange}
        />
        <pointLight
          shadow-mapSize={[2048, 2048]}
          castShadow
          position={[3.5, 10, 3.5]}
          intensity={0.65}
          color="#ffe0ec"
        />
        <hemisphereLight intensity={0.5} color="#ffa4a4" groundColor="#d886b7" />
        {/* @ts-ignore */}
        <animated.pointLight
          intensity={intensity}
          color="red"
          position={[redLightPosition.x, 1, redLightPosition.y]}
        />
        {board.map((row, i) => {
          return row.map((tile, j) => {
            const bg = `${(i + j) % 2 === 0 ? `white` : `black`}`
            const isSelected =
              tile.piece && selected?.getId() === tile.piece.getId()

            const canMoveHere = checkIfSelectedPieceCanMoveHere({
              tile,
              moves,
              selected,
            })

            const tileId = tile.piece?.getId()
            const pieceIsBeingReplaced =
              movingTo?.move.piece && tile.piece && movingTo?.move.capture
                ? tileId === createId(movingTo?.move.capture)
                : false
            const rookCastled = movingTo?.move.castling?.rook
            const isBeingCastled =
              rookCastled && createId(rookCastled) === tile.piece?.getId()

            const handleClick = (e: ThreeMouseEvent) => {
              if (movingTo) {
                return
              }

              const tileContainsOtherPlayersPiece =
                tile.piece && tile.piece?.color !== turn

              // In dev mode with allowAnyColorMove (PVP only), allow clicking any piece
              const canClickAnyPiece =
                devMode && allowAnyColorMove && gameType !== `local_ai`

              if (
                tileContainsOtherPlayersPiece &&
                !canMoveHere &&
                !isDev &&
                !canClickAnyPiece
              ) {
                setSelected(null)
                return
              }

              if (verboseLogging && tile.piece) {
                console.log(
                  `[Dev] Clicked tile:`,
                  tile.position,
                  `Piece:`,
                  tile.piece?.type,
                  tile.piece?.color,
                )
              }

              canMoveHere
                ? startMovingPiece(e, tile, canMoveHere)
                : selectThisPiece(e, tile)
            }

            const props: ModelProps = {
              position: [j, 0.5, i],
              scale: [0.15, 0.15, 0.15],
              color: tile.piece?.color || `white`,
              onClick: handleClick,
              isSelected: isSelected ? true : false,
              wasSelected: lastSelected
                ? lastSelected?.piece?.getId() === tile.piece?.getId()
                : false,
              canMoveHere: canMoveHere?.newPosition ?? null,
              movingTo:
                checkIfPositionsMatch(
                  tile.position,
                  movingTo?.move.piece?.position,
                ) && movingTo
                  ? movingTo.move.steps
                  : isBeingCastled
                    ? movingTo.move.castling?.rookSteps ?? null
                    : null,
              pieceIsBeingReplaced: pieceIsBeingReplaced ? true : false,
              finishMovingPiece: () =>
                isBeingCastled ? null : finishMovingPiece(movingTo?.tile ?? null),
            }

            const pieceId = tile.piece?.getId() ?? `empty-${j}-${i}`
            // All pieces now use full model pattern (temporary until Doctor Who models added)
            const isFullModel = true

            // Check if piece should be visible (for isolation mode)
            const pieceVisible = shouldShowPiece(tile.piece)

            // Calculate position - center isolated pieces
            const piecePosition: [number, number, number] =
              isolatedPiece && pieceVisible && tile.piece
                ? [3.5, 0.5, 3.5] // Center of board
                : [j, 0.5, i]

            // Apply rotation from debug panel for isolated pieces
            const pieceRotationRadians =
              isolatedPiece && pieceVisible && tile.piece
                ? ([
                  (pieceRotation.x * Math.PI) / 180,
                  (pieceRotation.y * Math.PI) / 180,
                  (pieceRotation.z * Math.PI) / 180,
                ] as [number, number, number])
                : ([0, 0, 0] as [number, number, number])

            return (
              <group key={`${j}-${i}`}>
                <TileComponent
                  color={bg}
                  position={[j, 0.25, i]}
                  onClick={handleClick}
                  canMoveHere={canMoveHere?.newPosition ?? null}
                />
                {pieceVisible && (
                  <MeshWrapper
                    key={pieceId}
                    {...props}
                    position={piecePosition}
                    isFullModel={isFullModel}
                  >
                    <group rotation={pieceRotationRadians}>
                      <PieceRenderer piece={tile.piece} {...props} />
                    </group>
                  </MeshWrapper>
                )}
              </group>
            )
          })
        })}
      </group>
    )
  }
