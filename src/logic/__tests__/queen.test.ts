/**
 * Tests for queen move generation
 * 
 * WHAT THESE TESTS DO:
 * - Verify queen combines rook + bishop movement
 * - Test blocking and captures
 * 
 * Queen is just rook + bishop combined, so if those work,
 * queen should work too. These tests verify the combination.
 */
import { createTestBoard } from '../board'
import { movesForPiece, type Move } from '../pieces'

// Helper to check if a move to position exists
const hasMoveTo = (moves: Move[], x: number, y: number): boolean => {
    return moves.some((m) => m.newPosition.x === x && m.newPosition.y === y)
}

describe('queen moves', () => {
    it('can move like both rook and bishop from center', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'queen' } },
        ])

        const queen = board[4][4].piece!
        const moves = movesForPiece({ piece: queen, board, propagateDetectCheck: false })

        // Rook-like moves (straight lines)
        expect(hasMoveTo(moves, 0, 4)).toBe(true) // left
        expect(hasMoveTo(moves, 7, 4)).toBe(true) // right
        expect(hasMoveTo(moves, 4, 0)).toBe(true) // up
        expect(hasMoveTo(moves, 4, 7)).toBe(true) // down

        // Bishop-like moves (diagonals)
        expect(hasMoveTo(moves, 0, 0)).toBe(true) // NW
        expect(hasMoveTo(moves, 7, 1)).toBe(true) // NE
        expect(hasMoveTo(moves, 7, 7)).toBe(true) // SE
        expect(hasMoveTo(moves, 1, 7)).toBe(true) // SW

        // Total: 14 rook + 13 bishop = 27 moves
        expect(moves).toHaveLength(27)
    })

    it('is blocked in both straight and diagonal directions', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'queen' } },
            { position: { x: 4, y: 2 }, piece: { color: 'white', id: 1, type: 'pawn' } }, // blocks up
            { position: { x: 6, y: 6 }, piece: { color: 'white', id: 2, type: 'pawn' } }, // blocks SE diagonal
        ])

        const queen = board[4][4].piece!
        const moves = movesForPiece({ piece: queen, board, propagateDetectCheck: false })

        // Blocked straight up
        expect(hasMoveTo(moves, 4, 3)).toBe(true)
        expect(hasMoveTo(moves, 4, 2)).toBe(false)

        // Blocked SE diagonal
        expect(hasMoveTo(moves, 5, 5)).toBe(true)
        expect(hasMoveTo(moves, 6, 6)).toBe(false)
    })

    it('can capture in any direction', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'queen' } },
            { position: { x: 4, y: 2 }, piece: { color: 'black', id: 1, type: 'knight' } }, // enemy straight
            { position: { x: 6, y: 6 }, piece: { color: 'black', id: 2, type: 'knight' } }, // enemy diagonal
        ])

        const queen = board[4][4].piece!
        const moves = movesForPiece({ piece: queen, board, propagateDetectCheck: false })

        // Capture straight
        const captureUp = moves.find((m) => m.newPosition.x === 4 && m.newPosition.y === 2)
        expect(captureUp?.type).toBe('capture')

        // Capture diagonal
        const captureDiag = moves.find((m) => m.newPosition.x === 6 && m.newPosition.y === 6)
        expect(captureDiag?.type).toBe('capture')
    })

    it('has limited moves from corner', () => {
        const board = createTestBoard([
            { position: { x: 0, y: 0 }, piece: { color: 'white', id: 1, type: 'queen' } },
        ])

        const queen = board[0][0].piece!
        const moves = movesForPiece({ piece: queen, board, propagateDetectCheck: false })

        // From corner: 7 right + 7 down + 7 diagonal = 21 moves
        expect(moves).toHaveLength(21)
    })
})
