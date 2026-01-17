import type { ChangeEvent, FC } from 'react'
import { useEffect, useState } from 'react'

import { css } from '@emotion/react'
import { toast } from 'react-toastify'
import { useShallow } from 'zustand/react/shallow'

import { AiSettings } from '@/components/AiSettings'
import { useAiGameStart } from '@/hooks/useAiGameStart'
import { useAiState } from '@/state/ai'
import { useGameSettingsState } from '@/state/game'
import { usePlayerState } from '@/state/player'
import { useSocketState } from '@/utils/socket'

export type JoinRoomClient = {
  room: string
  username: string
}

const filter = (
  e: ChangeEvent<HTMLInputElement>,
  set: (str: string) => void,
) => {
  const str = e.target.value
  const filtered = str.replace(/[^a-zA-Z0-9]/g, ``)
  set(filtered)
}

const tabStyle = (isActive: boolean) => css`
  padding: 8px 16px;
  cursor: pointer;
  border-bottom: 2px solid ${isActive ? `#000` : `transparent`};
  font-weight: ${isActive ? `bold` : `normal`};
  opacity: ${isActive ? 1 : 0.6};
  &:hover {
    opacity: 1;
  }
`

export const GameCreation: FC = () => {
  const [mode, setMode] = useState<`ai` | `online`>(`online`)
  const [autoStartAttempted, setAutoStartAttempted] = useState(false)
  const { room, username, joinedRoom, setUsername, setRoom, id, setJoinedRoom } =
    usePlayerState(useShallow((state) => state))
  const { socket } = useSocketState(
    useShallow((state) => ({
      socket: state.socket,
    })),
  )
  const setGameType = useGameSettingsState((state) => state.setGameType)
  const { currentConfig } = useAiState(useShallow((state) => state))

  // Hook for AI game initialization (consolidates auto-start and manual start logic)
  const { startAiGame: startAiGameWithDebug } = useAiGameStart({
    config: currentConfig,
    enableDebugMode: true,
  })
  const { startAiGame } = useAiGameStart({
    config: currentConfig,
  })

  // Check for URL parameters to auto-start game
  // URL: ?mode=debug -> Auto-start AI game with debug enabled
  useEffect(() => {
    if (autoStartAttempted || joinedRoom) return

    const urlParams = new URLSearchParams(window.location.search)
    const modeParam = urlParams.get(`mode`)

    if (modeParam === `debug`) {
      setAutoStartAttempted(true)
      console.log(
        `[GameCreation] Auto-starting AI game with debug mode via URL parameter`,
      )
      startAiGameWithDebug()
    }
  }, [autoStartAttempted, joinedRoom, startAiGameWithDebug])

  const sendRoom = async () => {
    if (!socket) return
    const data: JoinRoomClient = { room, username: `${username}#${id}` }
    socket.emit(`joinRoom`, data)
    socket.emit(`fetchPlayers`, { room })
    setGameType(`online`)
  }

  return (
    <>
      {!joinedRoom && (
        <>
          <div
            css={css`
              width: ${mode === `ai` ? `400px` : `300px`};
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 100;
              backdrop-filter: blur(30px);
              background-color: #ffffff8d;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              border-radius: 10px;
              padding: 25px 40px;
              gap: 20px;
              max-height: 80vh;
              overflow-y: auto;
              transition: width 0.3s ease;

              p {
                font-size: 12px;
                color: #00000092;
                padding-top: 10px;
              }
              input {
                padding-bottom: 10px;
                width: 100%;
                border-color: #000000;
                color: #000000;
                ::placeholder {
                  color: #000000;
                }
              }
              button.primary {
                width: 100%;
                padding: 10px;
                background: #000;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                margin-top: 10px;
                &:hover {
                  background: #333;
                }
              }
            `}
          >
            <div
              css={css`
                display: flex;
                gap: 20px;
                border-bottom: 1px solid #ccc;
                width: 100%;
                margin-bottom: 10px;
                justify-content: center;
              `}
            >
              <div
                css={tabStyle(mode === `online`)}
                onClick={() => setMode(`online`)}
              >
                Online
              </div>
              <div css={tabStyle(mode === `ai`)} onClick={() => setMode(`ai`)}>
                Play vs AI
              </div>
            </div>

            {mode === `online` ? (
              <form
                style={{
                  width: `100%`,
                  display: `flex`,
                  flexDirection: `column`,
                  gap: `20px`,
                }}
                onSubmit={(e) => {
                  e.preventDefault()
                  if (username.length < 3 || room.length < 3) {
                    toast.error(`Name or Room is too short.`, {
                      toastId: `nameOrRoomTooShort`,
                    })
                    return
                  }
                  sendRoom()
                }}
              >
                <input
                  type="text"
                  placeholder="Name"
                  value={username}
                  onChange={(e) => filter(e, setUsername)}
                  minLength={3}
                  maxLength={10}
                />
                <div>
                  <input
                    type="text"
                    placeholder="Room"
                    value={room}
                    onChange={(e) => filter(e, setRoom)}
                    minLength={3}
                    maxLength={16}
                  />
                  <p>If no room exists one will be created.</p>
                </div>
                <button type="submit" className="primary">
                  Join Room
                </button>
              </form>
            ) : (
              <div
                style={{
                  width: `100%`,
                  display: `flex`,
                  flexDirection: `column`,
                  gap: `20px`,
                }}
              >
                <AiSettings />
                <button className="primary" onClick={startAiGame}>
                  Start Game
                </button>
              </div>
            )}
          </div>
          <div
            css={css`
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: #00000021;
              z-index: 99;
            `}
          />
        </>
      )}
    </>
  )
}
