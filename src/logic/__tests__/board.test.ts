/**
 * Tests for board utility functions
 * 
 * WHAT THESE TESTS DO:
 * - Verify board creation produces correct initial positions
 * - Test position matching logic
 * - Test board copying (important for move validation)
 * 
 * WHAT THEY DON'T TEST:
 * - 3D rendering
 * - Visual appearance
 * - Animation states
 */
import {
    createBoard,
    createTestBoard,
    checkIfPositionsMatch,
    copyBoard,
    type Board,
} from '../board'

describe('createBoard', () => {
    let board: Board

    beforeEach(() => {
        board = createBoard()
    })

    it('creates an 8x8 board', () => {
        expect(board).toHaveLength(8)
        board.forEach((row) => {
            expect(row).toHaveLength(8)
        })
    })

    it('places black pieces on rows 0 and 1', () => {
        // Row 0: major pieces
        expect(board[0][0].piece?.type).toBe('rook')
        expect(board[0][0].piece?.color).toBe('black')
        expect(board[0][1].piece?.type).toBe('knight')
        expect(board[0][4].piece?.type).toBe('king')

        // Row 1: pawns
        for (let i = 0; i < 8; i++) {
            expect(board[1][i].piece?.type).toBe('pawn')
            expect(board[1][i].piece?.color).toBe('black')
        }
    })

    it('places white pieces on rows 6 and 7', () => {
        // Row 7: major pieces
        expect(board[7][0].piece?.type).toBe('rook')
        expect(board[7][0].piece?.color).toBe('white')
        expect(board[7][4].piece?.type).toBe('king')

        // Row 6: pawns
        for (let i = 0; i < 8; i++) {
            expect(board[6][i].piece?.type).toBe('pawn')
            expect(board[6][i].piece?.color).toBe('white')
        }
    })

    it('has empty tiles in the middle (rows 2-5)', () => {
        for (let y = 2; y <= 5; y++) {
            for (let x = 0; x < 8; x++) {
                expect(board[y][x].piece).toBeNull()
            }
        }
    })
})

describe('createTestBoard', () => {
    it('creates an empty board by default', () => {
        const board = createTestBoard([])
        for (let y = 0; y < 8; y++) {
            for (let x = 0; x < 8; x++) {
                expect(board[y][x].piece).toBeNull()
            }
        }
    })

    it('places pieces at specified positions', () => {
        const board = createTestBoard([
            { position: { x: 4, y: 4 }, piece: { color: 'white', id: 1, type: 'king' } },
            { position: { x: 0, y: 0 }, piece: { color: 'black', id: 1, type: 'queen' } },
        ])

        expect(board[4][4].piece?.type).toBe('king')
        expect(board[4][4].piece?.color).toBe('white')
        expect(board[0][0].piece?.type).toBe('queen')
        expect(board[0][0].piece?.color).toBe('black')
    })
})

describe('checkIfPositionsMatch', () => {
    it('returns true for matching positions', () => {
        expect(checkIfPositionsMatch({ x: 3, y: 5 }, { x: 3, y: 5 })).toBe(true)
    })

    it('returns false for different positions', () => {
        expect(checkIfPositionsMatch({ x: 3, y: 5 }, { x: 3, y: 6 })).toBe(false)
        expect(checkIfPositionsMatch({ x: 2, y: 5 }, { x: 3, y: 5 })).toBe(false)
    })

    it('returns false for null positions', () => {
        expect(checkIfPositionsMatch(null, { x: 3, y: 5 })).toBe(false)
        expect(checkIfPositionsMatch({ x: 3, y: 5 }, null)).toBe(false)
        expect(checkIfPositionsMatch(null, null)).toBe(false)
    })
})

describe('copyBoard', () => {
    it('creates a deep copy', () => {
        const original = createBoard()
        const copy = copyBoard(original)

        // Modify the copy
        copy[0][0].piece = null

        // Original should be unchanged
        expect(original[0][0].piece).not.toBeNull()
        expect(copy[0][0].piece).toBeNull()
    })

    it('preserves piece data', () => {
        const original = createBoard()
        const copy = copyBoard(original)

        expect(copy[7][4].piece?.type).toBe('king')
        expect(copy[7][4].piece?.color).toBe('white')
    })
})
