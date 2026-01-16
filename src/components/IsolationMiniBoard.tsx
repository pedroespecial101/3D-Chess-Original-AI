import type { FC } from 'react'

import { css } from '@emotion/react'
import {
    FaChessPawn,
    FaChessKnight,
    FaChessBishop,
    FaChessRook,
    FaChessQueen,
    FaChessKing,
} from 'react-icons/fa'

import { useGameSettingsState, type IsolatedPiece } from '@/state/game'
import type { Color } from '@/logic/pieces'

type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop' | 'queen' | 'king'

// Starting positions for pieces - simplified 8x8 board showing initial setup
const initialBoard: (({ type: PieceType; color: Color } | null)[])[] = [
    // Row 0 (black back rank)
    [
        { type: 'rook', color: 'black' },
        { type: 'knight', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'queen', color: 'black' },
        { type: 'king', color: 'black' },
        { type: 'bishop', color: 'black' },
        { type: 'knight', color: 'black' },
        { type: 'rook', color: 'black' },
    ],
    // Row 1 (black pawns)
    Array(8).fill({ type: 'pawn', color: 'black' }),
    // Rows 2-5 (empty)
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    Array(8).fill(null),
    // Row 6 (white pawns)
    Array(8).fill({ type: 'pawn', color: 'white' }),
    // Row 7 (white back rank)
    [
        { type: 'rook', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'queen', color: 'white' },
        { type: 'king', color: 'white' },
        { type: 'bishop', color: 'white' },
        { type: 'knight', color: 'white' },
        { type: 'rook', color: 'white' },
    ],
]

const PieceIcon: FC<{ type: PieceType }> = ({ type }) => {
    switch (type) {
        case 'pawn':
            return <FaChessPawn />
        case 'knight':
            return <FaChessKnight />
        case 'bishop':
            return <FaChessBishop />
        case 'rook':
            return <FaChessRook />
        case 'queen':
            return <FaChessQueen />
        case 'king':
            return <FaChessKing />
        default:
            return null
    }
}

export const IsolationMiniBoard: FC = () => {
    const { isolatedPiece, setIsolatedPiece } = useGameSettingsState((state) => ({
        isolatedPiece: state.isolatedPiece,
        setIsolatedPiece: state.setIsolatedPiece,
    }))

    const handlePieceClick = (piece: { type: PieceType; color: Color } | null) => {
        if (!piece) return

        // If clicking the same piece that's isolated, un-isolate it
        if (
            isolatedPiece &&
            isolatedPiece.type === piece.type &&
            isolatedPiece.color === piece.color
        ) {
            setIsolatedPiece(null)
        } else {
            // Otherwise, isolate this piece
            setIsolatedPiece({ type: piece.type, color: piece.color })
        }
    }

    const isIsolated = (piece: { type: PieceType; color: Color } | null) => {
        if (!piece || !isolatedPiece) return false
        return piece.type === isolatedPiece.type && piece.color === isolatedPiece.color
    }

    return (
        <div
            css={css`
        display: flex;
        flex-direction: column;
        gap: 8px;
      `}
        >
            <div
                css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
        `}
            >
                <span
                    css={css`
            font-size: 0.85rem;
            color: rgba(255, 255, 255, 0.7);
          `}
                >
                    Click a piece to isolate
                </span>
                {isolatedPiece && (
                    <button
                        onClick={() => setIsolatedPiece(null)}
                        css={css`
              background: rgba(255, 100, 100, 0.2);
              border: 1px solid rgba(255, 100, 100, 0.4);
              color: #ff6b6b;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 0.7rem;
              cursor: pointer;
              transition: all 0.2s;
              &:hover {
                background: rgba(255, 100, 100, 0.3);
              }
            `}
                    >
                        Clear
                    </button>
                )}
            </div>

            <div
                css={css`
          display: flex;
          flex-direction: column;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.15);
        `}
            >
                {initialBoard.map((row, i) => (
                    <div
                        key={i}
                        css={css`
              display: flex;
            `}
                    >
                        {row.map((piece, j) => {
                            const isLight = (i + j) % 2 === 0
                            const isPieceIsolated = isIsolated(piece)
                            const hasPiece = piece !== null

                            return (
                                <div
                                    key={j}
                                    onClick={() => handlePieceClick(piece)}
                                    css={css`
                    width: 24px;
                    height: 24px;
                    background-color: ${isPieceIsolated
                                            ? 'rgba(102, 126, 234, 0.6)'
                                            : isLight
                                                ? '#a5a5a5'
                                                : '#676767'};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: ${hasPiece ? 'pointer' : 'default'};
                    transition: all 0.15s ease;
                    border: ${isPieceIsolated
                                            ? '2px solid #667eea'
                                            : '2px solid transparent'};
                    box-sizing: border-box;
                    ${hasPiece &&
                                        `
                      &:hover {
                        background-color: ${isPieceIsolated
                                            ? 'rgba(102, 126, 234, 0.8)'
                                            : 'rgba(102, 126, 234, 0.3)'
                                        };
                      }
                    `}
                    svg {
                      font-size: 14px;
                      color: ${piece?.color === 'white' ? '#fff' : '#1a1a1a'};
                      filter: ${piece?.color === 'white'
                                            ? 'drop-shadow(0 1px 1px rgba(0,0,0,0.5))'
                                            : 'drop-shadow(0 1px 1px rgba(255,255,255,0.3))'};
                    }
                  `}
                                >
                                    {piece && <PieceIcon type={piece.type} />}
                                </div>
                            )
                        })}
                    </div>
                ))}
            </div>

            {isolatedPiece && (
                <div
                    css={css`
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px;
            background: rgba(102, 126, 234, 0.15);
            border-radius: 6px;
            border: 1px solid rgba(102, 126, 234, 0.3);
          `}
                >
                    <div
                        css={css`
              color: ${isolatedPiece.color === 'white' ? '#fff' : '#1a1a1a'};
              background: ${isolatedPiece.color === 'white' ? '#555' : '#ccc'};
              padding: 4px;
              border-radius: 4px;
              display: flex;
              align-items: center;
              justify-content: center;
            `}
                    >
                        <PieceIcon type={isolatedPiece.type} />
                    </div>
                    <span
                        css={css`
              font-size: 0.8rem;
              color: rgba(255, 255, 255, 0.9);
              text-transform: capitalize;
            `}
                    >
                        {isolatedPiece.color} {isolatedPiece.type}
                    </span>
                </div>
            )}
        </div>
    )
}
