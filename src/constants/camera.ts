/**
 * Camera-related constants for the 3D chess board.
 */

/** Default camera position [x, y, z] */
export const DEFAULT_CAMERA_POSITION: [number, number, number] = [-12, 5, 6]

/** Camera position when focusing on an isolated piece - close-up front view */
export const ISOLATED_PIECE_CAMERA_POSITION: [number, number, number] = [
  -0.01, 1.01, 2.02,
]

/** Camera target when focusing on isolated piece (character body height) */
export const ISOLATED_PIECE_CAMERA_TARGET: [number, number, number] = [
  0.05, 0.86, 0.04,
]

/** Default minimum zoom distance (close-up) */
export const DEFAULT_MIN_ZOOM = 3

/** Default maximum zoom distance (far away) */
export const DEFAULT_MAX_ZOOM = 25

/** Default camera field of view */
export const DEFAULT_CAMERA_FOV = 50
