import React from 'react'
import type { FC } from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

import type { ModelProps } from './index'
import { PieceMaterial } from './index'

type GLTFResult = GLTF & {
  nodes: {
    Object001004: THREE.Mesh
  }
  materials: {
    [`Object001_mtl.004`]: THREE.MeshStandardMaterial
  }
}

// Temporary component using original GLTF king model
// TODO: Replace with Doctor Who themed model when available
// NOTE: Do NOT pass originalMaterial - forces metallic mode for proper black/white coloring
export const KingModel: FC<ModelProps> = (props) => {
  const { nodes } = useGLTF(`/king.gltf`) as unknown as GLTFResult
  const { color, isSelected, pieceIsBeingReplaced } = props
  const materialProps = { color, isSelected, pieceIsBeingReplaced }

  return (
    <group dispose={null} scale={0.85}>
      <mesh geometry={nodes.Object001004.geometry}>
        <PieceMaterial {...materialProps} />
      </mesh>
    </group>
  )
}



useGLTF.preload(`/king.gltf`)
