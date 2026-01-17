import React from 'react'
import type { FC } from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

import type { ModelProps } from './index'
import { PieceMaterial } from './index'

/**
 * Configuration for a simple GLTF model (single mesh).
 * Used for standard chess pieces that haven't been replaced with Doctor Who models yet.
 */
export type SimpleGLTFConfig = {
  /** Path to the GLTF/GLB file in public folder (e.g., '/knight.gltf') */
  gltfPath: string
  /** The key to access the mesh geometry in nodes (e.g., 'Object001005') */
  geometryNodeKey: string
  /** Scale factor for the model */
  scale: number
}

type GenericGLTFResult = GLTF & {
  nodes: Record<string, THREE.Mesh>
  materials: Record<string, THREE.MeshStandardMaterial>
}

/**
 * Creates a simple GLTF model component for standard chess pieces.
 *
 * @example
 * ```tsx
 * const KnightModel = createSimpleGLTFModel({
 *   gltfPath: '/knight.gltf',
 *   geometryNodeKey: 'Object001005',
 *   scale: 0.95,
 * })
 * ```
 *
 * NOTE: These temporary pieces do NOT pass originalMaterial to PieceMaterial,
 * forcing metallic mode for proper black/white coloring.
 */
export function createSimpleGLTFModel(config: SimpleGLTFConfig): FC<ModelProps> {
  const { gltfPath, geometryNodeKey, scale } = config

  const ModelComponent: FC<ModelProps> = (props) => {
    const { nodes } = useGLTF(gltfPath) as unknown as GenericGLTFResult
    const { color, isSelected, pieceIsBeingReplaced } = props
    const materialProps = { color, isSelected, pieceIsBeingReplaced }

    const geometry = nodes[geometryNodeKey]?.geometry

    if (!geometry) {
      console.warn(
        `[SimpleGLTFModel] Geometry not found for key: ${geometryNodeKey} in ${gltfPath}`,
      )
      return null
    }

    return (
      <group dispose={null} scale={scale}>
        <mesh geometry={geometry}>
          <PieceMaterial {...materialProps} />
        </mesh>
      </group>
    )
  }

  // Preload the model
  useGLTF.preload(gltfPath)

  return ModelComponent
}

// ============================================================
// Pre-configured models for standard chess pieces
// TODO: Replace with Doctor Who themed models when available
// ============================================================

export const KnightModel = createSimpleGLTFModel({
  gltfPath: `/knight.gltf`,
  geometryNodeKey: `Object001005`,
  scale: 0.95,
})

export const BishopModel = createSimpleGLTFModel({
  gltfPath: `/bishop.gltf`,
  geometryNodeKey: `Object001002`,
  scale: 0.9,
})

export const QueenModel = createSimpleGLTFModel({
  gltfPath: `/queen.gltf`,
  geometryNodeKey: `Object001003`,
  scale: 0.85,
})

export const KingModel = createSimpleGLTFModel({
  gltfPath: `/king.gltf`,
  geometryNodeKey: `Object001004`,
  scale: 0.85,
})
