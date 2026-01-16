import { css } from '@emotion/react'

/**
 * Shared styles for debug and settings panels.
 * These styles are reused across DebugSettings.tsx and AiSettings.tsx.
 */

// ============================================================
// Layout Styles
// ============================================================

export const sectionStyle = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`

export const sectionTitleStyle = css`
  font-size: 0.85rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
`

export const toggleRowStyle = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const sliderContainerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

// ============================================================
// Typography Styles
// ============================================================

export const labelStyle = css`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
`

export const valueDisplayStyle = css`
  font-size: 0.8rem;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
`

// ============================================================
// Form Control Styles
// ============================================================

export const checkboxStyle = css`
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
`

export const sliderStyle = css`
  width: 100%;
  cursor: pointer;
  accent-color: #667eea;
`

// ============================================================
// Button Styles
// ============================================================

export const buttonStyle = css`
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

export const smallButtonStyle = css`
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

export const primaryButtonActiveStyle = css`
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: transparent;
`
