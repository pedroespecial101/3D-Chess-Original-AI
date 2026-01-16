import React, { useRef, useMemo } from 'react'
import type { FC } from 'react'
import * as THREE from 'three'

import type { Position } from '@logic/board'
import { useSpring, animated } from '@react-spring/three'
import type {
  AnimationControls,
  TargetAndTransition,
  VariantLabels,
  Transition,
} from 'framer-motion'
import { motion } from 'framer-motion-3d'
import { useGameSettingsState, TextureMode } from '@/state/game'

export type PieceMaterialProps = JSX.IntrinsicElements[`meshPhysicalMaterial`] & {
  isSelected: boolean
  pieceIsBeingReplaced: boolean
  originalMaterial?: THREE.Material | null
}

export const PieceMaterial: FC<PieceMaterialProps> = ({
  color,
  isSelected,
  pieceIsBeingReplaced,
  originalMaterial,
  ...props
}) => {
  const textureMode = useGameSettingsState((state) => state.textureMode)
  const { opacity } = useSpring({
    opacity: pieceIsBeingReplaced ? 0 : 1,
  })

  // Extract properties from original material if available
  const originalProps = useMemo(() => {
    if (!originalMaterial) return null

    const mat = originalMaterial as THREE.MeshStandardMaterial
    return {
      map: mat.map || null,
      color: mat.color ? mat.color.clone() : null,
      metalness: mat.metalness ?? 0,
      roughness: mat.roughness ?? 1,
      normalMap: mat.normalMap || null,
      aoMap: mat.aoMap || null,
      emissiveMap: mat.emissiveMap || null,
    }
  }, [originalMaterial])

  // Metallic mode (current behavior)
  if (textureMode === 'metallic' || !originalMaterial) {
    return (
      // @ts-ignore
      <animated.meshPhysicalMaterial
        reflectivity={4}
        color={color === `white` ? `#d9d9d9` : `#7c7c7c`}
        emissive={isSelected ? `#733535` : `#000000`}
        metalness={1}
        roughness={0.5}
        attach="material"
        envMapIntensity={0.2}
        opacity={opacity}
        transparent={true}
        {...props}
      />
    )
  }

  // Original mode - use GLB textures as-is
  if (textureMode === 'original') {
    return (
      // @ts-ignore
      <animated.meshPhysicalMaterial
        map={originalProps?.map}
        color={originalProps?.color || '#ffffff'}
        normalMap={originalProps?.normalMap}
        aoMap={originalProps?.aoMap}
        emissive={isSelected ? `#733535` : `#000000`}
        emissiveIntensity={isSelected ? 0.5 : 0}
        metalness={originalProps?.metalness ?? 0}
        roughness={originalProps?.roughness ?? 1}
        attach="material"
        envMapIntensity={0.3}
        opacity={opacity}
        transparent={true}
        {...props}
      />
    )
  }

  // Hybrid mode - original textures with metallic properties
  return (
    // @ts-ignore
    <animated.meshPhysicalMaterial
      map={originalProps?.map}
      color={originalProps?.color || '#ffffff'}
      normalMap={originalProps?.normalMap}
      aoMap={originalProps?.aoMap}
      emissive={isSelected ? `#733535` : `#000000`}
      emissiveIntensity={isSelected ? 0.5 : 0}
      metalness={0.7}
      roughness={0.35}
      reflectivity={2}
      attach="material"
      envMapIntensity={0.4}
      clearcoat={0.3}
      clearcoatRoughness={0.25}
      opacity={opacity}
      transparent={true}
      {...props}
    />
  )
}


export type ModelProps = JSX.IntrinsicElements[`group`] & {
  color: string
  isSelected: boolean
  canMoveHere: Position | null
  movingTo: Position | null
  finishMovingPiece: () => void
  pieceIsBeingReplaced: boolean
  wasSelected: boolean
  isFullModel?: boolean
}

export const MeshWrapper: FC<ModelProps> = ({
  movingTo,
  finishMovingPiece,
  isSelected,
  children,
  pieceIsBeingReplaced,
  wasSelected,
  isFullModel,
  ...props
}) => {
  const ref = useRef(null)
  const meshRef = useRef(null)

  const MotionComponent = (isFullModel ? motion.group : motion.mesh) as any

  return (
    <group ref={ref} {...props} dispose={null} castShadow>
      <MotionComponent
        ref={meshRef}
        scale={0.03}
        castShadow={pieceIsBeingReplaced ? false : true}
        receiveShadow
        initial={false}
        animate={
          movingTo
            ? variants.move({ movingTo, isSelected: true })
            : pieceIsBeingReplaced
              ? variants.replace({ movingTo, isSelected })
              : isSelected
                ? variants.select({ movingTo, isSelected })
                : variants.initial({ movingTo, isSelected })
        }
        transition={
          movingTo
            ? transitions.moveTo
            : pieceIsBeingReplaced
              ? transitions.replace
              : isSelected
                ? transitions.select
                : wasSelected
                  ? transitions.wasSelected
                  : transitions.initial
        }
        onAnimationComplete={() => {
          if (movingTo) {
            finishMovingPiece()
          }
        }}
      >
        {children}
        {!isFullModel && (
          <PieceMaterial
            color={props.color}
            pieceIsBeingReplaced={pieceIsBeingReplaced}
            isSelected={isSelected}
          />
        )}
      </MotionComponent>
    </group>
  )
}

export const FRAMER_MULTIPLIER = 6.66
export const getDistance = (px?: number): number =>
  px ? px * FRAMER_MULTIPLIER : 0

export const transitions: {
  select: Transition
  moveTo: Transition & { y: Transition }
  initial: Transition
  replace: Transition
  wasSelected: Transition
} = {
  moveTo: {
    type: `spring`,
    stiffness: 200,
    damping: 30,
    y: { delay: 0.15, stiffness: 120, damping: 5 },
  },
  select: {
    type: `spring`,
  },
  replace: {
    type: `spring`,
    stiffness: 50,
    damping: 5,
  },
  initial: {
    duration: 0,
  },
  wasSelected: {
    type: `spring`,
    duration: 0.5,
  },
}

export type VariantReturns =
  | AnimationControls
  | TargetAndTransition
  | VariantLabels
  | boolean
export type VariantProps = {
  isSelected: boolean
  movingTo: Position | null
}

type VariantFunction = (props: VariantProps) => VariantReturns
export const variants: {
  select: VariantFunction
  move: VariantFunction
  replace: VariantFunction
  initial: VariantFunction
} = {
  initial: () => ({
    x: 0,
  }),
  select: ({ isSelected }: VariantProps) => ({
    x: 0,
    y: isSelected ? 1.4 : 0,
    z: 0,
  }),
  move: ({ movingTo }: VariantProps) => ({
    x: getDistance(movingTo?.x),
    y: [1.4, 1.6, 0],
    z: getDistance(movingTo?.y),
  }),
  replace: () => ({
    y: 20,
    x: 5 * randomNegative(),
    z: 10 * randomNegative(),
    rotateX: (Math.PI / 4) * randomNegative(),
  }),
}

const randomNegative = () => (Math.random() > 0.5 ? -1 : 1)
