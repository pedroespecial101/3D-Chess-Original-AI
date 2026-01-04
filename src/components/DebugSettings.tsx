import type { FC } from 'react'
import React from 'react'
import { css } from '@emotion/react'
import { useGameSettingsState } from '@/state/game'

export const DebugSettings: FC = () => {
    const {
        minZoom, setMinZoom,
        maxZoom, setMaxZoom,
        showDebugSettings, setShowDebugSettings,
        enablePanning, setEnablePanning,
        triggerCameraReset
    } = useGameSettingsState((state) => ({
        minZoom: state.minZoom,
        setMinZoom: state.setMinZoom,
        maxZoom: state.maxZoom,
        setMaxZoom: state.setMaxZoom,
        showDebugSettings: state.showDebugSettings,
        setShowDebugSettings: state.setShowDebugSettings,
        enablePanning: state.enablePanning,
        setEnablePanning: state.setEnablePanning,
        triggerCameraReset: state.triggerCameraReset,
    }))

    if (!showDebugSettings) return null

    const handleReset = () => {
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
        width: 300px;
        background: rgba(0, 0, 0, 0.85);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 24px;
        color: white;
        z-index: 1000;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        gap: 20px;
      `}
        >
            <div
                css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        `}
            >
                <h2
                    css={css`
            margin: 0;
            font-size: 1.2rem;
            font-weight: 600;
            background: linear-gradient(90deg, #ff0080, #7928ca);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
          `}
                >
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

            <div
                css={css`
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        `}
            >
                <div css={css`display: flex; justify-content: space-between; align-items: center;`}>
                    <label css={css`font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);`}>Enable Panning (Right Click)</label>
                    <input
                        type="checkbox"
                        checked={enablePanning}
                        onChange={(e) => setEnablePanning(e.target.checked)}
                        css={css`
              width: 18px;
              height: 18px;
              cursor: pointer;
              accent-color: #ff0080;
            `}
                    />
                </div>
            </div>

            <div
                css={css`
          display: flex;
          flex-direction: column;
          gap: 8px;
        `}
            >
                <div css={css`display: flex; justify-content: space-between; align-items: center;`}>
                    <label css={css`font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);`}>Min Zoom (Zoom In)</label>
                    <span css={css`font-size: 0.8rem; font-family: monospace; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;`}>{minZoom}</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="15"
                    step="0.5"
                    value={minZoom}
                    onChange={(e) => setMinZoom(parseFloat(e.target.value))}
                    css={css`
            width: 100%;
            cursor: pointer;
            accent-color: #ff0080;
          `}
                />
            </div>

            <div
                css={css`
          display: flex;
          flex-direction: column;
          gap: 8px;
        `}
            >
                <div css={css`display: flex; justify-content: space-between; align-items: center;`}>
                    <label css={css`font-size: 0.9rem; color: rgba(255, 255, 255, 0.7);`}>Max Zoom (Zoom Out)</label>
                    <span css={css`font-size: 0.8rem; font-family: monospace; background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;`}>{maxZoom}</span>
                </div>
                <input
                    type="range"
                    min="15"
                    max="50"
                    step="1"
                    value={maxZoom}
                    onChange={(e) => setMaxZoom(parseFloat(e.target.value))}
                    css={css`
            width: 100%;
            cursor: pointer;
            accent-color: #7928ca;
          `}
                />
            </div>

            <button
                onClick={handleReset}
                css={css`
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: white;
          padding: 10px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: background 0.2s;
          &:hover {
            background: rgba(255, 255, 255, 0.2);
          }
        `}
            >
                Reset Camera & Zoom
            </button>

            <div css={css`
        padding-top: 5px;
        font-size: 0.8rem;
        color: rgba(255,255,255,0.4);
        font-style: italic;
      `}>
                More debug options coming soon...
            </div>
        </div>
    )
}
