/**
 * Tests for king move generation
 * 
 * WHAT THESE TESTS DO:
 * - Verify king can move 1 square in any direction
 * - Test blocking by friendly pieces
 * - Verify capture of enemy pieces
 * 
 * NOTE: Castling is tested separately as it requires
 * rooks in position and neither piece having moved.
 */
import { createTestBoard } from '../board'
import { movesForPiece, type Move } from '../pieces'

// Helper to check if a move to position exists
const hasMoveTo = (moves: Move[], x: number, y: number): boolean => {
    return moves.some((m) => m.newPosition.x === x && m.newPosition.y === y)
}

describe('king moves', () => {
    it('can move 1 square in all 8 directions from center', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'king' } },
        ])

        const king = board[4][4].piece!
        const moves = movesForPiece({ piece: king, board, propagateDetectCheck: false })

        // King should have 8 moves from center
        expect(hasMoveTo(moves, 3, 3)).toBe(true) // top-left
        expect(hasMoveTo(moves, 4, 3)).toBe(true) // top
        expect(hasMoveTo(moves, 5, 3)).toBe(true) // top-right
        expect(hasMoveTo(moves, 3, 4)).toBe(true) // left
        expect(hasMoveTo(moves, 5, 4)).toBe(true) // right
        expect(hasMoveTo(moves, 3, 5)).toBe(true) // bottom-left
        expect(hasMoveTo(moves, 4, 5)).toBe(true) // bottom
        expect(hasMoveTo(moves, 5, 5)).toBe(true) // bottom-right
        expect(moves).toHaveLength(8)
    })

    it('has limited moves from corner', () => {
        const board = createTestBoard([
            { position: { x: 0, y: 0 }, piece: { color: 'white', id: 1, type: 'king' } },
        ])

        const king = board[0][0].piece!
        const moves = movesForPiece({ piece: king, board, propagateDetectCheck: false })

        // From corner, only 3 moves available
        expect(hasMoveTo(moves, 1, 0)).toBe(true) // right
        expect(hasMoveTo(moves, 0, 1)).toBe(true) // down
        expect(hasMoveTo(moves, 1, 1)).toBe(true) // diagonal
        expect(moves).toHaveLength(3)
    })

    it('cannot move to square occupied by friendly piece', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'king' } },
            { position: { x: 5, y: 4 }, piece: { color: 'white', id: 1, type: 'pawn' } }, // friendly
        ])

        const king = board[4][4].piece!
        const moves = movesForPiece({ piece: king, board, propagateDetectCheck: false })

        // 8 - 1 blocked = 7 moves
        expect(hasMoveTo(moves, 5, 4)).toBe(false)
        expect(moves).toHaveLength(7)
    })

    it('can capture enemy piece', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'king' } },
            { position: { x: 5, y: 4 }, piece: { color: 'black', id: 1, type: 'pawn' } }, // enemy
        ])

        const king = board[4][4].piece!
        const moves = movesForPiece({ piece: king, board, propagateDetectCheck: false })

        const captureMove = moves.find((m) => m.newPosition.x === 5 && m.newPosition.y === 4)
        expect(captureMove).toBeDefined()
        expect(captureMove?.type).toBe('capture')
        expect(moves).toHaveLength(8)
    })

    it('can castle kingside when conditions met', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 7 }, piece: { color: 'white', id: 1, type: 'king' } },
            { position: { x: 7, y: 7 }, piece: { color: 'white', id: 1, type: 'rook' } },
        ])

        const king = board[7][4].piece!
        const moves = movesForPiece({ piece: king, board, propagateDetectCheck: false })

        // Regular moves + castling
        const castleMove = moves.find((m) => m.type === 'castling')
        expect(castleMove).toBeDefined()
        expect(castleMove?.newPosition.x).toBe(6) // kingside castle position
    })

    it('can castle queenside when conditions met', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 7 }, piece: { color: 'white', id: 1, type: 'king' } },
            { position: { x: 0, y: 7 }, piece: { color: 'white', id: 2, type: 'rook' } },
        ])

        const king = board[7][4].piece!
        const moves = movesForPiece({ piece: king, board, propagateDetectCheck: false })

        const castleMove = moves.find((m) => m.type === 'castling')
        expect(castleMove).toBeDefined()
        expect(castleMove?.newPosition.x).toBe(2) // queenside castle position
    })

    it('cannot castle if king has moved', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 7 }, piece: { color: 'white', id: 1, type: 'king' } },
            { position: { x: 7, y: 7 }, piece: { color: 'white', id: 1, type: 'rook' } },
        ])

        // Mark king as having moved
        const king = board[7][4].piece as any
        king.hasMoved = true

        const moves = movesForPiece({ piece: king, board, propagateDetectCheck: false })

        const castleMove = moves.find((m) => m.type === 'castling')
        expect(castleMove).toBeUndefined()
    })
})
