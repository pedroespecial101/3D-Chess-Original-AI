/**
 * Board-related constants for the 3D chess game.
 */

/** Board center position [x, y, z] - used for piece isolation */
export const BOARD_CENTER: [number, number, number] = [3.5, 0.5, 3.5]

/** Board offset position - shifts the entire board */
export const BOARD_OFFSET: [number, number, number] = [-3.5, -0.5, -3.5]

/** Multiplier for converting chess grid positions to Framer Motion coordinates */
export const FRAMER_MULTIPLIER = 6.66

/** Default piece scale factor */
export const DEFAULT_PIECE_SCALE = 0.15

/** Tile height offset from board surface */
export const TILE_Y_POSITION = 0.25

/** Piece height offset from board surface */
export const PIECE_Y_POSITION = 0.5
