import type { FC } from 'react'
import React, { useRef } from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

import { ModelProps } from './index'
import { TardisModel } from './Tardis'
import { CybermanModel } from './Cyberman'

type GLTFResult = GLTF & {
  nodes: {
    Object001001: THREE.Mesh
  }
  materials: {
    [`Object001_mtl.003`]: THREE.MeshStandardMaterial
  }
}

export const RookComponent: FC<ModelProps> = (props) => {
  const ref = useRef(null)
  const { nodes } = useGLTF(`/rook.gltf`) as unknown as GLTFResult
  const { color } = props

  // White rooks use Tardis, black rooks use Cyberman
  if (color === 'white') {
    return <TardisModel {...props} />
  }

  return <CybermanModel {...props} />
}

useGLTF.preload(`/rook.gltf`)
