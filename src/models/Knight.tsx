import React from 'react'
import type { FC } from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

import type { ModelProps } from './index'
import { PieceMaterial } from './index'

type GLTFResult = GLTF & {
  nodes: {
    Object001005: THREE.Mesh
  }
  materials: {
    [`Object001_mtl.005`]: THREE.MeshStandardMaterial
  }
}

// Temporary component using original GLTF knight model
// TODO: Replace with Doctor Who themed model when available
export const KnightModel: FC<ModelProps> = (props) => {
  const { nodes, materials } = useGLTF(`/knight.gltf`) as unknown as GLTFResult
  const { color, isSelected, pieceIsBeingReplaced } = props
  const materialProps = { color, isSelected, pieceIsBeingReplaced }

  return (
    <group dispose={null} scale={0.85}>
      <mesh geometry={nodes.Object001005.geometry}>
        <PieceMaterial
          {...materialProps}
          originalMaterial={materials[`Object001_mtl.005`]}
        />
      </mesh>
    </group>
  )
}

// Legacy component for backward compatibility
export const KnightComponent: FC = () => null

useGLTF.preload(`/knight.gltf`)
