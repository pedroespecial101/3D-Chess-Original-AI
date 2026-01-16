# Skill Level Interface Pattern (SLIP) - Technical Brief

## Overview
This document defines the **Skill Level Interface Pattern**, a user interface pattern designed to provide progressive disclosure of game difficulty settings. It transitions from simple, user-friendly "Presets" for casual users to a comprehensive "Advanced Configuration" panel for power users.

**Target Backend:** This pattern is specifically designed to interface with a **UCI (Universal Chess Interface) compatible engine** (specifically **Stockfish**), utilizing its standard `Skill Level`, `Elo`, and search time parameters.

**Goal:** Allow an AI agent to implement a consistent, high-quality difficulty system in any target project (e.g., a React Three Fiber game) that communicates with a UCI chess engine.

## Core Concepts

### 1. Progressive Disclosure
*   **Default View:** A single dropdown menu selecting a "Persona" or "Preset" (e.g., "Beginner", "Expert").
*   **Expanded View:** An "Advanced Settings" panel (modal or slide-out) that reveals the underlying UCI parameters and allows granular control.

### 2. Data Structure
The system relies on a unified configuration object that maps directly to Stockfish UCI options.

#### Configuration Object
```typescript
interface EngineConfig {
  skillLevel: number;      // Stockfish "Skill Level" option (0-20)
  depth: number;           // Search depth limit (1-25)
  movetime: number;        // Max time in ms (0 for unlimited/depth-based)
  useElo: boolean;         // Toggle to use "UCI_LimitStrength" & "UCI_Elo"
  eloRating?: number;      // Stockfish "UCI_Elo" value (1350-2850) - Alternative to skillLevel
}
```

#### Preset Structure
```typescript
interface DifficultyPreset {
  id: string;
  label: string;           // Display name (e.g., "Club Player")
  description: string;     // Helper text
  badge: string;           // Visual indicator class/color (Green/Yellow/Red)
  config: EngineConfig;    // Fixed values for this preset
}
```

## Functional Requirements

### 1. Preset Management
*   **Default Presets:** The system must initialize with standard presets calibrated to Stockfish levels (e.g., Skill 0 for beginners, Skill 20 for max).
*   **User Presets:** Users must be able to Create and Delete their own presets.
*   **Persistence:** All settings and user presets must be saved to local storage (or game save file).

### 2. Synchronization Logic (Critical)
The UI must maintain a two-way sync between the Preset Dropdown and the Advanced Sliders.

*   **Preset -> Sliders:** When a user selects a defined Preset (e.g., "Intermediate"), the advanced sliders/inputs must immediately update to reflect that preset's values (e.g., Skill slider moves to 10).
*   **Sliders -> Preset:** If the user manually moves a slider while a preset is active, the system must automatically switch the active mode to **"Custom"** (or deselect the preset) to indicate that current settings no longer match the standard profile.

### 3. 'Custom' Mode Behavior
*   The "Custom" state acts as a scratchpad.
*   It preserves the last user-modified values.
*   It is automatically selected when sliders are touched.
*   It allows saving the current state as a new **User Preset**.

### 4. Create/Delete (CRUD)
*   **Save as New Preset:** In the advanced panel, provide a mechanism to name and save the current slider configuration as a new User Preset. This preset then appears in the main dropdown list.
*   **Delete Preset:** User Presets should have a delete option. Default/System presets cannot be deleted.

## Implementation Guide for AI Agents

When implementing this in a new project (e.g., React Three Fiber settings menu):

1.  **State Store:** Create a reactive store (Zustand/Redux/Context) that holds:
    *   `currentConfig` (The active EngineConfig)
    *   `selectedPresetId` (String)
    *   `userPresets` (Array of DifficultyPreset)

2.  **UI Components:**
    *   **Dropdown:** Renders `[...defaultPresets, ...userPresets, 'Custom']`.
    *   **Badges:** Visual cues for difficulty (e.g., traffic light colors).
    *   **Sliders:** Bound to `currentConfig`. `onChange` triggers the "Switch to Custom" logic.

3.  **UCI Command Construction:**
    *   The UI output must be converted into UCI commands by the game engine.
    *   **If `useElo` is true:**
        *   `setoption name UCI_LimitStrength value true`
        *   `setoption name UCI_Elo value <eloRating>`
    *   **If `useElo` is false:**
        *   `setoption name Skill Level value <skillLevel>`
    *   **Search Command:**
        *   `go depth <depth> movetime <movetime>`

## Example Flow
1.  User starts game. Default is **"Casual"** (Skill 5).
2.  User opens **Advanced Panel**. Slider shows **5**.
3.  User slides Skill to **20**.
    *   System switches `selectedPresetId` to **"custom"**.
    *   Badge updates to **"Custom"**.
4.  User clicks **"Save as New Preset"**, names it **"God Mode"**.
    *   "God Mode" is added to `userPresets`.
    *   `selectedPresetId` becomes **"God Mode"**.
    *   Future sessions restore "God Mode" automatically.
