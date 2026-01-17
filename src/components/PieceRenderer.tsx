import type { FC } from 'react'
import React from 'react'

import type { ModelProps } from '@models/index'
import { PawnModel } from '@models/Pawn'
import { RookComponent } from '@models/Rook'
import {
    BishopModel,
    KingModel,
    KnightModel,
    QueenModel,
} from '@models/SimpleGLTFModel'
import { WeepingAngelModel } from '@models/WeepingAngel'

import type { Piece } from '@/logic/pieces'

export type PieceRendererProps = ModelProps & {
    /** The piece to render */
    piece: Piece | null
}

/**
 * Component that renders the appropriate 3D model for a chess piece.
 * Handles the piece type switching logic extracted from Board.tsx.
 */
export const PieceRenderer: FC<PieceRendererProps> = ({ piece, ...props }) => {
    if (!piece) return null

    switch (piece.type) {
        case `pawn`:
            return <PawnModel {...props} />
        case `rook`:
            return <RookComponent {...props} />
        case `knight`:
            // Black knights use Weeping Angel, white knights use standard model
            return piece.color === `black` ? (
                <WeepingAngelModel {...props} />
            ) : (
                <KnightModel {...props} />
            )
        case `bishop`:
            return <BishopModel {...props} />
        case `queen`:
            return <QueenModel {...props} />
        case `king`:
            return <KingModel {...props} />
        default:
            return null
    }
}
