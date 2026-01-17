import React from 'react'

import { useGLTF } from '@react-three/drei'
import type * as THREE from 'three'
import type { GLTF } from 'three-stdlib'

import type { ModelProps, PieceMaterialOverrides } from './index'
import { PieceMaterial } from './index'

type GLTFResult = GLTF & {
    nodes: {
        mesh0: THREE.Mesh
    }
    materials: {
        object_0: THREE.MeshStandardMaterial
    }
}

// ============================================================================
// WEEPING ANGEL MATERIAL PRESETS
// ============================================================================
// The Weeping Angel is a stone statue, so it should NOT be metallic.
// Choose one of the presets below by uncommenting it, or create your own.
//
// PROPERTY GUIDE:
// - metalness: 0 = non-metallic (stone), 1 = fully metallic (metal)
// - roughness: 0 = smooth/shiny (polished), 1 = rough/matte (weathered stone)
// - baseColor: The base color tint (affects the overall tone)
// - clearcoat: 0 = no clearcoat, 1 = full clearcoat (wet/polished look)
// - clearcoatRoughness: How rough the clearcoat layer is
// - reflectivity: How much light reflects (0-4+, lower = more matte)
// - envMapIntensity: How much environment lighting affects the piece
// ============================================================================

// PRESET 1: Classic Grey Stone (Recommended for black side)
// A traditional grey granite look - matte and non-metallic
const CLASSIC_GREY_STONE: PieceMaterialOverrides = {
    metalness: 0.05,
    roughness: 0.85,  // Reduced from 0.85 - slightly less matte
    baseColor: `#8a8a8a`,
    clearcoat: 0,
    reflectivity: 0.8,  // Increased from 0.5
    envMapIntensity: 0.5,  // Increased from 0.2 - picks up more ambient light
}

// PRESET 2: Dark Slate
// Darker with a subtle blue-grey tint
const DARK_SLATE: PieceMaterialOverrides = {
    metalness: 0.15,
    roughness: 0.8,
    baseColor: `#3d4045`,
    clearcoat: 0,
    reflectivity: 0.6,
    envMapIntensity: 0.25,
}

// PRESET 3: Weathered Stone
// Slightly warm, aged stone look
const WEATHERED_STONE: PieceMaterialOverrides = {
    metalness: 0.05,
    roughness: 0.9,
    baseColor: `#6b6b5f`,
    clearcoat: 0,
    reflectivity: 0.3,
    envMapIntensity: 0.15,
}

// PRESET 4: Cool Marble (slightly polished)
// Lighter grey with a subtle polish
const COOL_MARBLE: PieceMaterialOverrides = {
    metalness: 0.2,
    roughness: 0.7,
    baseColor: `#7a7a80`,
    clearcoat: 0.1,
    clearcoatRoughness: 0.5,
    reflectivity: 1.0,
    envMapIntensity: 0.3,
}

// PRESET 5: Cemetery Stone(very dark, mysterious)
// Dark and foreboding, like a graveyard statue
const CEMETERY_STONE: PieceMaterialOverrides = {
    metalness: 0.08,
    roughness: 0.88,
    baseColor: `#454545`,
    clearcoat: 0,
    reflectivity: 0.4,
    envMapIntensity: 0.18,
}

// ============================================================================
// ACTIVE PRESET - Change this to switch between presets
// ============================================================================
const STONE_MATERIAL = CLASSIC_GREY_STONE

export const WeepingAngelModel: React.FC<ModelProps> = (props) => {
    const { nodes, materials } = useGLTF(`/weepingAngel.glb`) as unknown as GLTFResult
    const { color, isSelected, pieceIsBeingReplaced } = props
    const materialProps = { color, isSelected, pieceIsBeingReplaced }

    // White pieces need to face the opposite direction
    const yRotation = color === `white` ? Math.PI : 0

    return (
        <group dispose={null} scale={180} rotation={[0, yRotation, 0]}>
            <mesh geometry={nodes.mesh0.geometry} scale={0.5}>
                <PieceMaterial
                    {...materialProps}
                    originalMaterial={materials.object_0}
                    overrides={STONE_MATERIAL}
                />
            </mesh>
        </group>
    )
}

useGLTF.preload(`/weepingAngel.glb`)
