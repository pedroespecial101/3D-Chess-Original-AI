import * as THREE from 'three'
import React from 'react'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

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

export const DalekModel: React.FC<JSX.IntrinsicElements['group']> = (props) => {
    const { nodes, materials } = useGLTF('/dalek.glb') as unknown as GLTFResult
    return (
        <group {...props} dispose={null}>
            <mesh geometry={nodes.Object_4.geometry} material={materials.PaletteMaterial001} position={[0, 0.781, 0]} />
            <mesh geometry={nodes.Object_35.geometry} material={materials.PaletteMaterial002} position={[0.194, 1.508, -0.023]} rotation={[0, 0.001, -0.716]} scale={0.5} />
            <mesh geometry={nodes.Object_50.geometry} material={materials.PaletteMaterial003} position={[0, 0.984, -0.072]} scale={[1.074, 1.082, 1.074]} />
        </group>
    )
}

useGLTF.preload('/dalek.glb')
