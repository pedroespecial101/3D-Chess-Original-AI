import { useEffect, useCallback, type MutableRefObject } from 'react'

import { useThree } from '@react-three/fiber'

import {
    DEFAULT_CAMERA_POSITION,
    ISOLATED_PIECE_CAMERA_POSITION,
    ISOLATED_PIECE_CAMERA_TARGET,
} from '@/constants/camera'
import type { IsolatedPiece } from '@/state/game'
import type { CameraMove } from '@/server/cameraMove'
import type { Color } from '@logic/pieces'

export type UseCameraControlsOptions = {
    /** Reference to OrbitControls */
    controlsRef: MutableRefObject<any>
    /** Counter that triggers camera reset when incremented */
    cameraResetCounter: number
    /** The piece currently being isolated for inspection */
    isolatedPiece: IsolatedPiece
    /** Whether to log camera actions */
    verboseLogging: boolean
    /** Game type for determining camera sync behavior */
    gameType: `local_ai` | `local` | `online`
    /** Socket for online multiplayer camera sync */
    socket: any
    /** Room ID for multiplayer */
    room: string
    /** Player color for camera sync */
    playerColor: Color
    /** Whether dev mode is enabled (for camera logging) */
    devMode?: boolean
}

export type UseCameraControlsResult = {
    /** Callback to attach to OrbitControls onChange event for camera logging */
    handleCameraChange: () => void
}

/**
 * Hook that manages camera controls including:
 * - Camera reset from debug panel
 * - Focus on isolated piece
 * - Camera sync for online multiplayer
 * - Camera position logging in dev mode
 */
export function useCameraControls(options: UseCameraControlsOptions): UseCameraControlsResult {
    const {
        controlsRef,
        cameraResetCounter,
        isolatedPiece,
        verboseLogging,
        gameType,
        socket,
        room,
        playerColor,
        devMode = false,
    } = options

    const { camera } = useThree()

    // Camera reset from debug panel
    useEffect(() => {
        if (cameraResetCounter > 0) {
            camera.position.set(...DEFAULT_CAMERA_POSITION)
            if (controlsRef.current) {
                controlsRef.current.target.set(0, 0, 0)
                controlsRef.current.update()
            }
        }
    }, [cameraResetCounter, camera, controlsRef])

    // Focus camera on isolated piece
    useEffect(() => {
        if (isolatedPiece && controlsRef.current) {
            camera.position.set(...ISOLATED_PIECE_CAMERA_POSITION)
            controlsRef.current.target.set(...ISOLATED_PIECE_CAMERA_TARGET)
            controlsRef.current.update()
            if (verboseLogging) {
                console.log(
                    `[Dev] Camera focused on isolated piece:`,
                    isolatedPiece.type,
                    isolatedPiece.color,
                )
            }
        }
    }, [isolatedPiece, camera, verboseLogging, controlsRef])

    // Camera sync for online multiplayer (disabled for local AI)
    useEffect(() => {
        if (gameType === `local_ai`) return // No camera sync for local AI
        const interval = setInterval(() => {
            const { x, y, z } = camera.position
            socket?.emit(`cameraMove`, {
                position: [x, y, z],
                room: room,
                color: playerColor,
            } satisfies CameraMove)
        }, 1000)
        return () => clearInterval(interval)
    }, [camera.position, socket, room, playerColor, gameType])

    // Camera change handler for logging in dev mode
    const handleCameraChange = useCallback(() => {
        if (devMode && controlsRef.current) {
            const pos = camera.position
            const target = controlsRef.current.target
            console.log(
                `[Camera] Position: [${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)}]`,
                `Target: [${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`
            )
        }
    }, [devMode, camera, controlsRef])

    return { handleCameraChange }
}

