/**
 * Tests for pawn move generation
 * 
 * WHAT THESE TESTS DO:
 * - Verify pawn forward movement (1 or 2 squares from start)
 * - Test diagonal capture (only when enemy present)
 * - Pawn cannot move forward if blocked
 * 
 * NOTE: En passant and promotion are NOT tested here
 * because they require move history state (Zustand).
 */
import { createTestBoard } from '../board'
import { movesForPiece, type Move } from '../pieces'

// Helper to check if a move to position exists
const hasMoveTo = (moves: Move[], x: number, y: number): boolean => {
    return moves.some((m) => m.newPosition.x === x && m.newPosition.y === y)
}

describe('pawn moves', () => {
    it('white pawn can move forward 1 or 2 from starting position', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 6 }, piece: { color: 'white', id: 1, type: 'pawn' } },
        ])

        const pawn = board[6][4].piece!
        const moves = movesForPiece({ piece: pawn, board, propagateDetectCheck: false })

        // White pawns move "up" (decreasing y)
        expect(hasMoveTo(moves, 4, 5)).toBe(true) // 1 square forward
        expect(hasMoveTo(moves, 4, 4)).toBe(true) // 2 squares from start
        expect(moves).toHaveLength(2)
    })

    it('black pawn can move forward 1 or 2 from starting position', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 1 }, piece: { color: 'black', id: 1, type: 'pawn' } },
        ])

        const pawn = board[1][4].piece!
        const moves = movesForPiece({ piece: pawn, board, propagateDetectCheck: false })

        // Black pawns move "down" (increasing y)
        expect(hasMoveTo(moves, 4, 2)).toBe(true) // 1 square forward
        expect(hasMoveTo(moves, 4, 3)).toBe(true) // 2 squares from start
        expect(moves).toHaveLength(2)
    })

    it('pawn can only move 1 square after first move', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'pawn' } },
        ])

        // Simulate pawn has moved by setting hasMoved
        const pawn = board[4][4].piece as any
        pawn.hasMoved = true

        const moves = movesForPiece({ piece: pawn, board, propagateDetectCheck: false })

        expect(hasMoveTo(moves, 4, 3)).toBe(true) // 1 square only
        expect(hasMoveTo(moves, 4, 2)).toBe(false) // no 2 squares
        expect(moves).toHaveLength(1)
    })

    it('pawn cannot move forward if blocked', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 6 }, piece: { color: 'white', id: 1, type: 'pawn' } },
            { position: { x: 4, y: 5 }, piece: { color: 'black', id: 1, type: 'pawn' } }, // blocker
        ])

        const pawn = board[6][4].piece!
        const moves = movesForPiece({ piece: pawn, board, propagateDetectCheck: false })

        // Pawn is completely blocked, no forward moves
        expect(moves).toHaveLength(0)
    })

    it('pawn can capture diagonally', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'pawn' } },
            { position: { x: 3, y: 3 }, piece: { color: 'black', id: 1, type: 'knight' } }, // capture left
            { position: { x: 5, y: 3 }, piece: { color: 'black', id: 2, type: 'knight' } }, // capture right
        ])

        const pawn = board[4][4].piece as any
        pawn.hasMoved = true

        const moves = movesForPiece({ piece: pawn, board, propagateDetectCheck: false })

        // 1 forward + 2 diagonal captures
        expect(hasMoveTo(moves, 4, 3)).toBe(true) // forward
        expect(hasMoveTo(moves, 3, 3)).toBe(true) // capture left
        expect(hasMoveTo(moves, 5, 3)).toBe(true) // capture right
        expect(moves).toHaveLength(3)
    })

    it('pawn cannot capture friendly pieces diagonally', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'pawn' } },
            { position: { x: 3, y: 3 }, piece: { color: 'white', id: 1, type: 'knight' } }, // friendly
        ])

        const pawn = board[4][4].piece as any
        pawn.hasMoved = true

        const moves = movesForPiece({ piece: pawn, board, propagateDetectCheck: false })

        // Only forward move, no diagonal capture of friendly
        expect(hasMoveTo(moves, 4, 3)).toBe(true)
        expect(hasMoveTo(moves, 3, 3)).toBe(false)
        expect(moves).toHaveLength(1)
    })
})
