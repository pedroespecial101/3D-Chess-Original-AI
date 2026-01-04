import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

import { PieceMaterial, ModelProps } from './index'

type GLTFResult = GLTF & {
    nodes: {
        Object_4: THREE.Mesh
        Object_35: THREE.Mesh
        Object_50: THREE.Mesh
    }
    materials: {
        PaletteMaterial001: THREE.MeshStandardMaterial
        PaletteMaterial002: THREE.MeshStandardMaterial
        PaletteMaterial003: THREE.MeshStandardMaterial
    }
}

export const DalekModel: React.FC<ModelProps> = (props) => {
    const { nodes } = useGLTF('/dalek.glb') as unknown as GLTFResult
    const { color, isSelected, pieceIsBeingReplaced } = props
    const materialProps = { color, isSelected, pieceIsBeingReplaced }

    // White pieces need to face the opposite direction
    const yRotation = color === 'white' ? Math.PI : 0

    return (
        <group dispose={null} scale={180} rotation={[0, yRotation, 0]}>
            <mesh geometry={nodes.Object_4.geometry} position={[0, 0.781, 0]}>
                <PieceMaterial {...materialProps} />
            </mesh>
            <mesh geometry={nodes.Object_35.geometry} position={[0.194, 1.508, -0.023]} rotation={[0, 0.001, -0.716]} scale={0.5}>
                <PieceMaterial {...materialProps} />
            </mesh>
            <mesh geometry={nodes.Object_50.geometry} position={[0, 0.984, -0.072]} scale={[1.074, 1.082, 1.074]}>
                <PieceMaterial {...materialProps} />
            </mesh>
        </group>
    )
}

useGLTF.preload('/dalek.glb')
