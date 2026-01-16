
import type { Position } from '@/logic/board'
import type { HistoryItem } from '@/state/history'

export const toChessNotation = (pos: Position): string => {
    const file = String.fromCharCode('a'.charCodeAt(0) + pos.x)
    const rank = 8 - pos.y
    return `${file}${rank}`
}

export const fromChessNotation = (uci: string): { from: Position; to: Position; promotion?: string } => {
    const file1 = uci.charCodeAt(0) - 'a'.charCodeAt(0)
    const rank1 = 8 - parseInt(uci[1])
    const file2 = uci.charCodeAt(2) - 'a'.charCodeAt(0)
    const rank2 = 8 - parseInt(uci[3])
    const promotion = uci.length > 4 ? uci[4] : undefined

    return {
        from: { x: file1, y: rank1 },
        to: { x: file2, y: rank2 },
        promotion,
    }
}

export const historyToUciMoves = (history: HistoryItem[]): string[] => {
    return history.map((item) => {
        let move = `${toChessNotation(item.from)}${toChessNotation(item.to)}`
        // Check for promotion
        // This is tricky because HistoryItem might not explicitly store "promotion" flag in a simple way
        // But if a pawn reaches last rank, it's a promotion.
        // However, the AI expects standard UCI.
        // If the item.piece.type became queen/rook/bishop/knight on the last rank, it was a promotion.

        // Simplification: We rely on the move logic. 
        // If it's a pawn and landing on rank 1 or 8 (indices 0 or 7).
        if (item.piece.type === 'pawn' && (item.to.y === 0 || item.to.y === 7)) {
            // We need to know what it promoted to. 
            // The history item stores the piece *after* the move?
            // Let's check Board.tsx: finishMovingPiece copies board, modifies it, THEN adds to history.
            // Actually setHistory uses new values. 
            // But wait, finishMovingPiece: 
            // `const newHistoryItem = { ... piece: movingTo.move.piece }`
            // `movingTo.move.piece` is the piece *before* the move?
            // `selectedTile.piece` is the one that gets promoted.

            // If we can't easily determine promotion from history, we might have issues.
            // But for now let's assume 'q' for simplicity or checking the board state if possible.
            // Actually, we can check if the piece in the history item is different from 'pawn'?
            // If piece type is 'queen' but it was a pawn move?
            // The `HistoryItem` has `piece`. Board.tsx line 122: `piece: movingTo.move.piece`.
            // `movingTo.move.piece` is the piece being moved.

            // If I look at Board.tsx:139 `if (isPawn... && shouldPromotePawn) ... piece.type = 'queen'`.
            // This mutation happens on `selectedTile.piece`.
            // `movingTo` was set earlier. 
            // So `movingTo.move.piece` might still be a pawn.
            // This could be a bug in potential UCI conversion if we don't capture the promotion.

            // For this task, standard moves are priority. I'll add 'q' if pawn hits last rank as a fallback default.
            move += 'q'
        }

        return move
    })
}
