import type { FC } from 'react'
import React from 'react'

import { css } from '@emotion/react'
import { FaPlay, FaPause, FaStepForward, FaUndo } from 'react-icons/fa'

import { IsolationMiniBoard } from './IsolationMiniBoard'
import { useGameSettingsState } from '@/state/game'
import { useShallow } from 'zustand/react/shallow'

// Reusable styles
const sectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

const sectionTitleStyle = css`
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`

const toggleRowStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const labelStyle = css`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`

const checkboxStyle = css`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
`

const sliderContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const sliderStyle = css`
  width: 100%;
  cursor: pointer;
  accent-color: #667eea;
`

const buttonStyle = css`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const smallButtonStyle = css`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`

const valueDisplayStyle = css`
  font-size: 0.8rem;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
`

export const DebugSettings: FC = () => {
  const {
    minZoom,
    setMinZoom,
    maxZoom,
    setMaxZoom,
    showDebugSettings,
    setShowDebugSettings,
    enablePanning,
    setEnablePanning,
    triggerCameraReset,
    // Dev mode state
    devMode,
    allowAnyColorMove,
    setAllowAnyColorMove,
    isolatedPiece,
    freeMove,
    setFreeMove,
    verboseLogging,
    setVerboseLogging,
    animationSpeed,
    setAnimationSpeed,
    animationPlaying,
    setAnimationPlaying,
    animationLoop,
    setAnimationLoop,
    pieceRotation,
    setPieceRotation,
    resetPieceRotation,
    triggerBoardReset,
    textureMode,
    setTextureMode,
  } = useGameSettingsState(
    useShallow((state) => ({
      minZoom: state.minZoom,
      setMinZoom: state.setMinZoom,
      maxZoom: state.maxZoom,
      setMaxZoom: state.setMaxZoom,
      showDebugSettings: state.showDebugSettings,
      setShowDebugSettings: state.setShowDebugSettings,
      enablePanning: state.enablePanning,
      setEnablePanning: state.setEnablePanning,
      triggerCameraReset: state.triggerCameraReset,
      // Dev mode
      devMode: state.devMode,
      allowAnyColorMove: state.allowAnyColorMove,
      setAllowAnyColorMove: state.setAllowAnyColorMove,
      isolatedPiece: state.isolatedPiece,
      freeMove: state.freeMove,
      setFreeMove: state.setFreeMove,
      verboseLogging: state.verboseLogging,
      setVerboseLogging: state.setVerboseLogging,
      animationSpeed: state.animationSpeed,
      setAnimationSpeed: state.setAnimationSpeed,
      animationPlaying: state.animationPlaying,
      setAnimationPlaying: state.setAnimationPlaying,
      animationLoop: state.animationLoop,
      setAnimationLoop: state.setAnimationLoop,
      pieceRotation: state.pieceRotation,
      setPieceRotation: state.setPieceRotation,
      resetPieceRotation: state.resetPieceRotation,
      triggerBoardReset: state.triggerBoardReset,
      textureMode: state.textureMode,
      setTextureMode: state.setTextureMode,
    })),
  )

  if (!showDebugSettings) return null

  const handleCameraReset = () => {
    setMinZoom(3)
    setMaxZoom(25)
    triggerCameraReset()
  }

  return (
    <div
      css={css`
        position: fixed;
        top: 20px;
        right: 20px;
        width: 320px;
        max-height: calc(100vh - 40px);
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 20px;
        color: white;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        gap: 16px;

        /* Custom scrollbar */
        &::-webkit-scrollbar {
          width: 6px;
        }
        &::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
        }
        &::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
        }
      `}
    >
      {/* Header */}
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
      >
        <h2
          css={css`
            margin: 0;
            font-size: 1.1rem;
            font-weight: 600;
            background: linear-gradient(90deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            display: flex;
            align-items: center;
            gap: 8px;
          `}
        >
          {devMode && (
            <span
              css={css`
                background: linear-gradient(135deg, #667eea, #764ba2);
                -webkit-background-clip: unset;
                -webkit-text-fill-color: unset;
                color: white;
                font-size: 0.65rem;
                padding: 2px 6px;
                border-radius: 4px;
                font-weight: 600;
              `}
            >
              DEV
            </span>
          )}
          Debug Settings
        </h2>
        <button
          onClick={() => setShowDebugSettings(false)}
          css={css`
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.5);
            cursor: pointer;
            font-size: 1.5rem;
            line-height: 1;
            padding: 0;
            transition: color 0.2s;
            &:hover {
              color: white;
            }
          `}
        >
          ×
        </button>
      </div>

      {/* Dev Mode Section - Only show if in dev mode */}
      {devMode && (
        <div css={sectionStyle}>
          <span css={sectionTitleStyle}>🛠️ Development Mode</span>

          <div css={toggleRowStyle}>
            <label css={labelStyle}>Move Any Color</label>
            <input
              type="checkbox"
              checked={allowAnyColorMove}
              onChange={(e) => setAllowAnyColorMove(e.target.checked)}
              css={checkboxStyle}
            />
          </div>

          <div css={toggleRowStyle}>
            <label css={labelStyle}>Free Move (No Rules)</label>
            <input
              type="checkbox"
              checked={freeMove}
              onChange={(e) => setFreeMove(e.target.checked)}
              css={checkboxStyle}
            />
          </div>

          <div css={toggleRowStyle}>
            <label css={labelStyle}>Verbose Logging</label>
            <input
              type="checkbox"
              checked={verboseLogging}
              onChange={(e) => setVerboseLogging(e.target.checked)}
              css={checkboxStyle}
            />
          </div>

          <button onClick={triggerBoardReset} css={buttonStyle}>
            🔄 Reset Board
          </button>
        </div>
      )}

      {/* Piece Isolation Section - Only show if in dev mode */}
      {devMode && (
        <div css={sectionStyle}>
          <span css={sectionTitleStyle}>🎯 Piece Isolation</span>
          <IsolationMiniBoard />
        </div>
      )}

      {/* Animation Controls - Only show when a piece is isolated */}
      {devMode && isolatedPiece && (
        <div css={sectionStyle}>
          <span css={sectionTitleStyle}>🎬 Animation Controls</span>

          <div
            css={css`
              display: flex;
              gap: 8px;
              justify-content: center;
            `}
          >
            <button
              onClick={() => setAnimationPlaying(!animationPlaying)}
              css={smallButtonStyle}
              title={animationPlaying ? `Pause` : `Play`}
            >
              {animationPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={() => {
                // Step forward logic - can be connected to animation frame stepping
                console.log(`Step forward`)
              }}
              css={smallButtonStyle}
              title="Step Forward"
            >
              <FaStepForward />
            </button>
          </div>

          <div css={sliderContainerStyle}>
            <div css={toggleRowStyle}>
              <label css={labelStyle}>Speed</label>
              <span css={valueDisplayStyle}>{animationSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2"
              step="0.1"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
              css={sliderStyle}
            />
          </div>

          <div css={toggleRowStyle}>
            <label css={labelStyle}>Loop Animation</label>
            <input
              type="checkbox"
              checked={animationLoop}
              onChange={(e) => setAnimationLoop(e.target.checked)}
              css={checkboxStyle}
            />
          </div>
        </div>
      )}

      {/* Piece Rotation - Only show when a piece is isolated */}
      {devMode && isolatedPiece && (
        <div css={sectionStyle}>
          <span css={sectionTitleStyle}>🔄 Piece Rotation</span>

          {([`x`, `y`, `z`] as const).map((axis) => (
            <div key={axis} css={sliderContainerStyle}>
              <div css={toggleRowStyle}>
                <label css={labelStyle}>{axis.toUpperCase()} Axis</label>
                <span css={valueDisplayStyle}>{pieceRotation[axis]}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={pieceRotation[axis]}
                onChange={(e) =>
                  setPieceRotation({
                    ...pieceRotation,
                    [axis]: parseInt(e.target.value),
                  })
                }
                css={sliderStyle}
              />
            </div>
          ))}

          <button onClick={resetPieceRotation} css={smallButtonStyle}>
            <FaUndo /> Reset Rotation
          </button>
        </div>
      )}

      {/* Camera Controls */}
      <div css={sectionStyle}>
        <span css={sectionTitleStyle}>📷 Camera Controls</span>

        <div css={toggleRowStyle}>
          <label css={labelStyle}>Enable Panning</label>
          <input
            type="checkbox"
            checked={enablePanning}
            onChange={(e) => setEnablePanning(e.target.checked)}
            css={checkboxStyle}
          />
        </div>

        <div css={sliderContainerStyle}>
          <div css={toggleRowStyle}>
            <label css={labelStyle}>Min Zoom (Zoom In)</label>
            <span css={valueDisplayStyle}>{minZoom}</span>
          </div>
          <input
            type="range"
            min="1"
            max="15"
            step="0.5"
            value={minZoom}
            onChange={(e) => setMinZoom(parseFloat(e.target.value))}
            css={sliderStyle}
          />
        </div>

        <div css={sliderContainerStyle}>
          <div css={toggleRowStyle}>
            <label css={labelStyle}>Max Zoom (Zoom Out)</label>
            <span css={valueDisplayStyle}>{maxZoom}</span>
          </div>
          <input
            type="range"
            min="15"
            max="50"
            step="1"
            value={maxZoom}
            onChange={(e) => setMaxZoom(parseFloat(e.target.value))}
            css={sliderStyle}
          />
        </div>

        <button onClick={handleCameraReset} css={buttonStyle}>
          Reset Camera & Zoom
        </button>
      </div>

      {/* Texture Mode */}
      <div css={sectionStyle}>
        <span css={sectionTitleStyle}>🎨 Texture Mode</span>
        <div
          css={css`
            display: flex;
            gap: 8px;
          `}
        >
          {([`metallic`, `original`, `hybrid`] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setTextureMode(mode)}
              css={css`
                ${smallButtonStyle};
                flex: 1;
                text-transform: capitalize;
                ${textureMode === mode
                  ? `
                                        background: linear-gradient(135deg, #667eea, #764ba2);
                                        border-color: transparent;
                                    `
                  : ``}
              `}
            >
              {mode}
            </button>
          ))}
        </div>
        <span
          css={css`
            font-size: 0.75rem;
            color: rgba(255, 255, 255, 0.5);
            font-style: italic;
          `}
        >
          {textureMode === `metallic` && `Uniform chrome/metallic appearance`}
          {textureMode === `original` && `Original GLB textures from models`}
          {textureMode === `hybrid` && `Original textures with metallic sheen`}
        </span>
      </div>
    </div>
  )
}
