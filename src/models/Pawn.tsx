import type { FC } from 'react'
import React from 'react'

import { DalekModel } from './Dalek'
import type { ModelProps } from './index'
import { K9Model } from './K9'

export const PawnModel: FC<ModelProps> = (props) => {
  // Doctor Who side (white) uses K-9, Enemy side (black) uses Daleks
  return props.color === `white` ? (
    <K9Model {...props} />
  ) : (
    <DalekModel {...props} />
  )
}

export const PawnPreload = (): null => {
  return null
}
