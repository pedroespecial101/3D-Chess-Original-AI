/**
 * Tests for knight move generation
 * 
 * WHAT THESE TESTS DO:
 * - Verify knight L-shaped movement pattern
 * - Test move blocking by friendly pieces
 * - Test capture of enemy pieces
 * 
 * WHY KNIGHT FIRST:
 * Knight is the simplest piece to test because:
 * - Moves are always the same L-shape
 * - Can jump over pieces (no path blocking)
 * - No special moves (unlike pawn's en passant, castle for king/rook)
 */
import { createTestBoard } from '../board'
import { movesForPiece, type Move } from '../pieces'

// Helper to check if a move to position exists
const hasMoveTo = (moves: Move[], x: number, y: number): boolean => {
    return moves.some((m) => m.newPosition.x === x && m.newPosition.y === y)
}

describe('knight moves', () => {
    it('can make all 8 L-shaped moves from center', () => {
        // Knight in center with no blockers
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'knight' } },
        ])

        const knight = board[4][4].piece!
        const moves = movesForPiece({ piece: knight, board, propagateDetectCheck: false })

        // Knights move in L-shape: 2 squares one direction, 1 square perpendicular
        // From (4,4), all 8 possible knight moves:
        expect(hasMoveTo(moves, 6, 5)).toBe(true) // right 2, down 1
        expect(hasMoveTo(moves, 6, 3)).toBe(true) // right 2, up 1
        expect(hasMoveTo(moves, 2, 5)).toBe(true) // left 2, down 1
        expect(hasMoveTo(moves, 2, 3)).toBe(true) // left 2, up 1
        expect(hasMoveTo(moves, 5, 6)).toBe(true) // right 1, down 2
        expect(hasMoveTo(moves, 5, 2)).toBe(true) // right 1, up 2
        expect(hasMoveTo(moves, 3, 6)).toBe(true) // left 1, down 2
        expect(hasMoveTo(moves, 3, 2)).toBe(true) // left 1, up 2

        expect(moves).toHaveLength(8)
    })

    it('has limited moves from corner', () => {
        // Knight in corner
        const board = createTestBoard([
            { position: { x: 0, y: 0 }, piece: { color: 'white', id: 1, type: 'knight' } },
        ])

        const knight = board[0][0].piece!
        const moves = movesForPiece({ piece: knight, board, propagateDetectCheck: false })

        // From corner, only 2 moves are on the board
        expect(hasMoveTo(moves, 2, 1)).toBe(true)
        expect(hasMoveTo(moves, 1, 2)).toBe(true)
        expect(moves).toHaveLength(2)
    })

    it('cannot move to square occupied by friendly piece', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'knight' } },
            { position: { x: 6, y: 5 }, piece: { color: 'white', id: 1, type: 'pawn' } }, // friendly blocker
        ])

        const knight = board[4][4].piece!
        const moves = movesForPiece({ piece: knight, board, propagateDetectCheck: false })

        // Should have 7 moves (8 - 1 blocked by friendly pawn)
        expect(hasMoveTo(moves, 6, 5)).toBe(false)
        expect(moves).toHaveLength(7)
    })

    it('can capture enemy piece', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'knight' } },
            { position: { x: 6, y: 5 }, piece: { color: 'black', id: 1, type: 'pawn' } }, // enemy target
        ])

        const knight = board[4][4].piece!
        const moves = movesForPiece({ piece: knight, board, propagateDetectCheck: false })

        // Should still have 8 moves, one of which is a capture
        const captureMove = moves.find((m) => m.newPosition.x === 6 && m.newPosition.y === 5)
        expect(captureMove).toBeDefined()
        expect(captureMove?.type).toBe('capture')
        expect(moves).toHaveLength(8)
    })

    it('can jump over other pieces', () => {
        // Knight surrounded by pieces but can still move
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'knight' } },
            { position: { x: 3, y: 4 }, piece: { color: 'white', id: 1, type: 'pawn' } },
            { position: { x: 5, y: 4 }, piece: { color: 'white', id: 2, type: 'pawn' } },
            { position: { x: 4, y: 3 }, piece: { color: 'white', id: 3, type: 'pawn' } },
            { position: { x: 4, y: 5 }, piece: { color: 'white', id: 4, type: 'pawn' } },
        ])

        const knight = board[4][4].piece!
        const moves = movesForPiece({ piece: knight, board, propagateDetectCheck: false })

        // Knight should still have all 8 L-shaped moves available
        expect(moves).toHaveLength(8)
    })
})
