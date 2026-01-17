/**
 * Tests for rook move generation
 * 
 * WHAT THESE TESTS DO:
 * - Verify rook can move horizontally and vertically
 * - Test blocking by pieces
 * - Test captures
 */
import { createTestBoard } from '../board'
import { movesForPiece, type Move } from '../pieces'

// Helper to check if a move to position exists
const hasMoveTo = (moves: Move[], x: number, y: number): boolean => {
    return moves.some((m) => m.newPosition.x === x && m.newPosition.y === y)
}

describe('rook moves', () => {
    it('can move horizontally and vertically from center', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'rook' } },
        ])

        const rook = board[4][4].piece!
        const moves = movesForPiece({ piece: rook, board, propagateDetectCheck: false })

        // Should have 14 moves (7 horizontal + 7 vertical)
        // Left: x0-3, Right: x5-7, Up: y0-3, Down: y5-7
        expect(hasMoveTo(moves, 0, 4)).toBe(true) // far left
        expect(hasMoveTo(moves, 7, 4)).toBe(true) // far right
        expect(hasMoveTo(moves, 4, 0)).toBe(true) // far up
        expect(hasMoveTo(moves, 4, 7)).toBe(true) // far down
        expect(moves).toHaveLength(14)
    })

    it('cannot move diagonally', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'rook' } },
        ])

        const rook = board[4][4].piece!
        const moves = movesForPiece({ piece: rook, board, propagateDetectCheck: false })

        // Diagonals should NOT be valid
        expect(hasMoveTo(moves, 5, 5)).toBe(false)
        expect(hasMoveTo(moves, 3, 3)).toBe(false)
        expect(hasMoveTo(moves, 5, 3)).toBe(false)
    })

    it('is blocked by friendly piece', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'rook' } },
            { position: { x: 4, y: 2 }, piece: { color: 'white', id: 1, type: 'pawn' } }, // blocks up
        ])

        const rook = board[4][4].piece!
        const moves = movesForPiece({ piece: rook, board, propagateDetectCheck: false })

        // Cannot move to or past the pawn
        expect(hasMoveTo(moves, 4, 3)).toBe(true) // one before pawn
        expect(hasMoveTo(moves, 4, 2)).toBe(false) // pawn position
        expect(hasMoveTo(moves, 4, 1)).toBe(false) // past pawn
        expect(hasMoveTo(moves, 4, 0)).toBe(false) // far past pawn
    })

    it('can capture enemy piece but not move past', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'rook' } },
            { position: { x: 4, y: 2 }, piece: { color: 'black', id: 1, type: 'pawn' } }, // enemy
        ])

        const rook = board[4][4].piece!
        const moves = movesForPiece({ piece: rook, board, propagateDetectCheck: false })

        // CAN capture enemy
        const captureMove = moves.find((m) => m.newPosition.x === 4 && m.newPosition.y === 2)
        expect(captureMove).toBeDefined()
        expect(captureMove?.type).toBe('capture')

        // But cannot move past
        expect(hasMoveTo(moves, 4, 1)).toBe(false)
        expect(hasMoveTo(moves, 4, 0)).toBe(false)
    })

    it('has limited moves from corner', () => {
        const board = createTestBoard([
            { position: { x: 0, y: 0 }, piece: { color: 'white', id: 1, type: 'rook' } },
        ])

        const rook = board[0][0].piece!
        const moves = movesForPiece({ piece: rook, board, propagateDetectCheck: false })

        // 7 right + 7 down = 14 moves
        expect(moves).toHaveLength(14)
    })
})
