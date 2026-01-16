
import type { FC } from 'react'
import { useState } from 'react'

import { css } from '@emotion/react'
import { useAiState, DEFAULT_PRESETS } from '@/state/ai'
import { useShallow } from 'zustand/react/shallow'

const containerStyle = css`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  color: #000;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 5px;
    font-size: 12px;
    font-weight: 500;
  }

  input[type='range'] {
    width: 100%;
  }

  input[type='number'] {
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    width: 100%;
  }

  select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid #ccc;
    background: white;
    width: 100%;
  }

  .advanced-panel {
    border-top: 1px solid #ccc;
    padding-top: 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .badge {
    display: inline-block;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 10px;
    text-transform: uppercase;
    font-weight: bold;
    margin-left: 8px;
  }
  
  .badge-green { background: #dcfce7; color: #166534; }
  .badge-yellow { background: #fef9c3; color: #854d0e; }
  .badge-red { background: #fee2e2; color: #991b1b; }
  .badge-blue { background: #dbeafe; color: #1e40af; }

  button {
    padding: 8px 16px;
    background: #000;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }

    &:hover:not(:disabled) {
      background: #333;
    }
  }

  .row {
    display: flex;
    gap: 10px;
    align-items: center;
  }
`

export const AiSettings: FC = () => {
    const {
        currentConfig,
        selectedPresetId,
        userPresets,
        selectPreset,
        updateConfig,
        saveUserPreset,
        deleteUserPreset,
    } = useAiState(useShallow((state) => state))

    const [showAdvanced, setShowAdvanced] = useState(false)
    const [newPresetName, setNewPresetName] = useState('')

    const allPresets = [...DEFAULT_PRESETS, ...userPresets]
    const currentPreset = allPresets.find((p) => p.id === selectedPresetId)

    const handleSavePreset = () => {
        if (newPresetName.trim()) {
            saveUserPreset(newPresetName)
            setNewPresetName('')
        }
    }

    return (
        <div css={containerStyle}>
            <div className="row">
                <div style={{ flex: 1 }}>
                    <label>
                        Difficulty Level
                        <select
                            value={selectedPresetId}
                            onChange={(e) => selectPreset(e.target.value)}
                        >
                            <optgroup label="Standard">
                                {DEFAULT_PRESETS.map((p) => (
                                    <option key={p.id} value={p.id}>
                                        {p.label}
                                    </option>
                                ))}
                            </optgroup>
                            {userPresets.length > 0 && (
                                <optgroup label="My Presets">
                                    {userPresets.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.label}
                                        </option>
                                    ))}
                                </optgroup>
                            )}
                            <option value="custom">Custom Configuration...</option>
                        </select>
                    </label>
                </div>
                {currentPreset && (
                    <span className={`badge badge-${currentPreset.badge}`}>
                        {currentPreset.label}
                    </span>
                )}
                {selectedPresetId === 'custom' && (
                    <span className="badge badge-blue">Custom</span>
                )}
            </div>

            <div style={{ fontSize: '12px', color: '#666' }}>
                {currentPreset
                    ? currentPreset.description
                    : 'Custom AI configuration.'}
            </div>

            <div>
                <button onClick={() => setShowAdvanced(!showAdvanced)}>
                    {showAdvanced ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
                </button>
            </div>

            {showAdvanced && (
                <div className="advanced-panel">
                    <label>
                        Skill Level ({currentConfig.skillLevel})
                        <input
                            type="range"
                            min="0"
                            max="20"
                            value={currentConfig.skillLevel}
                            disabled={currentConfig.useElo}
                            onChange={(e) =>
                                updateConfig({ skillLevel: parseInt(e.target.value) })
                            }
                        />
                    </label>

                    <label className="row">
                        <input
                            type="checkbox"
                            style={{ width: 'auto' }}
                            checked={currentConfig.useElo}
                            onChange={(e) => updateConfig({ useElo: e.target.checked })}
                        />
                        Use ELO Rating (simulates human strength)
                    </label>

                    {currentConfig.useElo && (
                        <label>
                            ELO Rating ({currentConfig.eloRating || 1350})
                            <input
                                type="range"
                                min="1350"
                                max="2850"
                                value={currentConfig.eloRating || 1350}
                                onChange={(e) =>
                                    updateConfig({ eloRating: parseInt(e.target.value) })
                                }
                            />
                        </label>
                    )}

                    <label>
                        Search Depth ({currentConfig.depth})
                        <input
                            type="range"
                            min="1"
                            max="25"
                            value={currentConfig.depth}
                            onChange={(e) =>
                                updateConfig({ depth: parseInt(e.target.value) })
                            }
                        />
                    </label>

                    <label>
                        Move Time Limit (ms)
                        <input
                            type="number"
                            value={currentConfig.movetime}
                            onChange={(e) =>
                                updateConfig({ movetime: parseInt(e.target.value) })
                            }
                        />
                    </label>

                    <div style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                        <label>Save Custom Preset</label>
                        <div className="row">
                            <input
                                type="text"
                                placeholder="Preset Name (e.g. Training Bot)"
                                value={newPresetName}
                                onChange={(e) => setNewPresetName(e.target.value)}
                            />
                            <button disabled={!newPresetName} onClick={handleSavePreset}>
                                Save
                            </button>
                        </div>
                    </div>

                    {selectedPresetId === 'custom' && (
                        <p style={{ fontSize: '11px', color: '#666' }}>
                            Modify settings to switch to "Custom" mode automatically.
                        </p>
                    )}

                    {userPresets.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            <label>Manage Presets</label>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {userPresets.map(p => (
                                    <div key={p.id} className="row" style={{ justifyContent: 'space-between' }}>
                                        <span>{p.label}</span>
                                        <button
                                            style={{ background: '#ef4444', padding: '4px 8px' }}
                                            onClick={() => deleteUserPreset(p.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
