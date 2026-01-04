import React, { useRef } from 'react'
import type { FC } from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

import { DalekModel } from './Dalek'
import { ModelProps } from './index'

export const PawnModel: FC<ModelProps> = (props) => {
  return <DalekModel {...props} />
}

export const PawnPreload = () => {
  return null
}

