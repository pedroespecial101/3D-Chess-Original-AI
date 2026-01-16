import type { FC } from 'react'
import { useEffect, useState } from 'react'

import { css } from '@emotion/react'
import type { Board } from '@logic/board'
import { createBoard } from '@logic/board'
import type { Color, GameOverType, Move, Piece } from '@logic/pieces'
import { Environment, useProgress } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useShallow } from 'zustand/react/shallow'

import { BoardComponent } from '@/components/Board'
import { Chat } from '@/components/Chat'
import { DebugSettings } from '@/components/DebugSettings'
import { GameCreation } from '@/components/GameCreation'
import { GameOverScreen } from '@/components/GameOverScreen'
import { Loader } from '@/components/Loader'
import { Opponent } from '@/components/Opponent'
import { Sidebar } from '@/components/Sidebar'
import { StatusBar } from '@/components/StatusBar'
import { Toast } from '@/components/Toast'
import { Border } from '@/models/Border'
import { useGameSettingsState } from '@/state/game'
import { useHistoryState } from '@/state/history'
import { usePlayerState } from '@/state/player'
import { useSockets } from '@/utils/socket'

export type GameOver = {
  type: GameOverType
  winner: Color
}

export const Home: FC = () => {
  const [board, setBoard] = useState<Board>(createBoard())
  const [selected, setSelected] = useState<Piece | null>(null)
  const [moves, setMoves] = useState<Move[]>([])
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const resetHistory = useHistoryState((state) => state.reset)
  const {
    resetTurn,
    boardResetCounter,
    showDebugSettings,
    setShowDebugSettings,
  } = useGameSettingsState(
    useShallow((state) => ({
      resetTurn: state.resetTurn,
      gameStarted: state.gameStarted,
      boardResetCounter: state.boardResetCounter,
      showDebugSettings: state.showDebugSettings,
      setShowDebugSettings: state.setShowDebugSettings,
    })),
  )
  const { joined } = usePlayerState(
    useShallow((state) => ({
      joined: state.joinedRoom,
    })),
  )

  const reset = () => {
    setBoard(createBoard())
    setSelected(null)
    setMoves([])
    resetHistory()
    resetTurn()
    setGameOver(null)
  }

  useSockets({ reset })

  // Handle board reset from debug panel
  useEffect(() => {
    if (boardResetCounter > 0) {
      reset()
    }
  }, [boardResetCounter])

  const [total, setTotal] = useState(0)
  const { progress } = useProgress()
  useEffect(() => {
    setTotal(progress)
  }, [progress])

  return (
    <div
      css={css`
        height: 100vh;
        width: 100vw;
        background-color: #000;
        background: linear-gradient(180deg, #000000, #242424);
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      `}
    >
      {total === 100 ? <GameCreation /> : <Loader />}
      <Sidebar board={board} moves={moves} selected={selected} />
      {joined && <Chat />}
      <StatusBar />
      <DebugSettings />
      <button
        onClick={() => setShowDebugSettings(!showDebugSettings)}
        css={css`
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s;
          z-index: 100;
          &:hover {
            background: rgba(255, 255, 255, 0.15);
            border-color: rgba(255, 255, 255, 0.4);
          }
        `}
      >
        Debug
      </button>
      <GameOverScreen gameOver={gameOver} />
      <Toast />
      <Canvas shadows camera={{ position: [-12, 5, 6], fov: 50 }}>
        <Environment files={`dawn.hdr`} />
        <Opponent />
        <Border />
        <BoardComponent
          selected={selected}
          setSelected={setSelected}
          board={board}
          setBoard={setBoard}
          moves={moves}
          setMoves={setMoves}
          setGameOver={setGameOver}
        />
      </Canvas>
    </div>
  )
}

export default Home
