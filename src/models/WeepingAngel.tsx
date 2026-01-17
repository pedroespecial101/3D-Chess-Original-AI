import React from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

import type { ModelProps } from './index'
import { PieceMaterial } from './index'

type GLTFResult = GLTF & {
    nodes: {
        material: THREE.Mesh
    }
    materials: {
        'Material.001': THREE.MeshStandardMaterial
    }
}

export const WeepingAngelModel: React.FC<ModelProps> = (props) => {
    const { nodes, materials } = useGLTF(
        `/weepingAngel_orig.glb`,
    ) as unknown as GLTFResult
    const { color, isSelected, pieceIsBeingReplaced } = props
    const materialProps = { color, isSelected, pieceIsBeingReplaced }

    // White pieces need to face the opposite direction
    const yRotation = color === `white` ? Math.PI : 0

    return (
        <group dispose={null} scale={380} rotation={[0, yRotation, 0]}>
            <mesh geometry={nodes.material.geometry} rotation={[Math.PI / 2, 0, 0]}>
                <PieceMaterial
                    {...materialProps}
                    originalMaterial={materials[`Material.001`]}
                />
            </mesh>
        </group>
    )
}

useGLTF.preload(`/weepingAngel_orig.glb`)
