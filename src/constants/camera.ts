/**
 * Camera-related constants for the 3D chess board.
 */

/** Default camera position [x, y, z] */
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [-12, 5, 6]

/** Camera position when focusing on an isolated piece */
export const ISOLATED_PIECE_CAMERA_POSITION: [number, number, number] = [-6, 4, 4]

/** Camera target when focusing on isolated piece (center of board) */
export const ISOLATED_PIECE_CAMERA_TARGET: [number, number, number] = [3.5, 0, 3.5]

/** Default minimum zoom distance (close-up) */
export const DEFAULT_MIN_ZOOM = 3

/** Default maximum zoom distance (far away) */
export const DEFAULT_MAX_ZOOM = 25

/** Default camera field of view */
export const DEFAULT_CAMERA_FOV = 50
