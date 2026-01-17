/**
 * Tests for bishop move generation
 * 
 * WHAT THESE TESTS DO:
 * - Verify bishop can move diagonally
 * - Test blocking by pieces
 * - Test captures
 */
import { createTestBoard } from '../board'
import { movesForPiece, type Move } from '../pieces'

// Helper to check if a move to position exists
const hasMoveTo = (moves: Move[], x: number, y: number): boolean => {
    return moves.some((m) => m.newPosition.x === x && m.newPosition.y === y)
}

describe('bishop moves', () => {
    it('can move diagonally from center', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'bishop' } },
        ])

        const bishop = board[4][4].piece!
        const moves = movesForPiece({ piece: bishop, board, propagateDetectCheck: false })

        // Should have moves in all 4 diagonal directions
        expect(hasMoveTo(moves, 0, 0)).toBe(true) // top-left diagonal
        expect(hasMoveTo(moves, 7, 1)).toBe(true) // top-right diagonal
        expect(hasMoveTo(moves, 7, 7)).toBe(true) // bottom-right diagonal
        expect(hasMoveTo(moves, 1, 7)).toBe(true) // bottom-left diagonal

        // From center (4,4): 4 NW + 3 NE + 3 SW + 3 SE = 13 moves
        expect(moves).toHaveLength(13)
    })

    it('cannot move horizontally or vertically', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'bishop' } },
        ])

        const bishop = board[4][4].piece!
        const moves = movesForPiece({ piece: bishop, board, propagateDetectCheck: false })

        // Straight lines should NOT be valid
        expect(hasMoveTo(moves, 4, 0)).toBe(false) // up
        expect(hasMoveTo(moves, 4, 7)).toBe(false) // down
        expect(hasMoveTo(moves, 0, 4)).toBe(false) // left
        expect(hasMoveTo(moves, 7, 4)).toBe(false) // right
    })

    it('is blocked by friendly piece', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'bishop' } },
            { position: { x: 2, y: 2 }, piece: { color: 'white', id: 1, type: 'pawn' } }, // blocks NW
        ])

        const bishop = board[4][4].piece!
        const moves = movesForPiece({ piece: bishop, board, propagateDetectCheck: false })

        // Cannot move to or past the pawn on NW diagonal
        expect(hasMoveTo(moves, 3, 3)).toBe(true) // one before pawn
        expect(hasMoveTo(moves, 2, 2)).toBe(false) // pawn position
        expect(hasMoveTo(moves, 1, 1)).toBe(false) // past pawn
        expect(hasMoveTo(moves, 0, 0)).toBe(false) // corner past pawn
    })

    it('can capture enemy piece', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'bishop' } },
            { position: { x: 2, y: 2 }, piece: { color: 'black', id: 1, type: 'knight' } }, // enemy
        ])

        const bishop = board[4][4].piece!
        const moves = movesForPiece({ piece: bishop, board, propagateDetectCheck: false })

        // CAN capture enemy
        const captureMove = moves.find((m) => m.newPosition.x === 2 && m.newPosition.y === 2)
        expect(captureMove).toBeDefined()
        expect(captureMove?.type).toBe('capture')

        // But cannot move past
        expect(hasMoveTo(moves, 1, 1)).toBe(false)
        expect(hasMoveTo(moves, 0, 0)).toBe(false)
    })

    it('has limited moves from corner', () => {
        const board = createTestBoard([
            { position: { x: 0, y: 0 }, piece: { color: 'white', id: 1, type: 'bishop' } },
        ])

        const bishop = board[0][0].piece!
        const moves = movesForPiece({ piece: bishop, board, propagateDetectCheck: false })

        // Only one diagonal available from corner: 7 squares
        expect(moves).toHaveLength(7)
    })
})
