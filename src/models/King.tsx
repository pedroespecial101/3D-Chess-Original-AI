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
export const KingModel: FC<ModelProps> = (props) => {
  const { nodes, materials } = useGLTF(`/king.gltf`) as unknown as GLTFResult
  const { color, isSelected, pieceIsBeingReplaced } = props
  const materialProps = { color, isSelected, pieceIsBeingReplaced }

  return (
    <group dispose={null} scale={0.85}>
      <mesh geometry={nodes.Object001004.geometry}>
        <PieceMaterial
          {...materialProps}
          originalMaterial={materials[`Object001_mtl.004`]}
        />
      </mesh>
    </group>
  )
}

// Legacy component for backward compatibility
export const KingComponent: FC = () => null

useGLTF.preload(`/king.gltf`)
