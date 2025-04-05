import React from 'react'
import { useLoader, ThreeElements } from '@react-three/fiber'
import * as THREE from 'three'

type ShirtModelProps = ThreeElements['group'] & {
  shirtImage?: string
}

export default function ShirtModel({ shirtImage, ...props }: ShirtModelProps) {
  // Use the provided shirtImage or default to '/wasted_designtee.png'
  const textureUrl = shirtImage || '/wasted_designtee.png'
  const texture = useLoader(THREE.TextureLoader, textureUrl)

  // Clone the texture so we can modify them independently for front and back
  const frontTexture = texture.clone()
  const backTexture = texture.clone()

  // For horizontal trimming:
  // Front texture uses the left half of the image
  frontTexture.repeat.set(0.48, 1) // Use half the width, full height
  frontTexture.offset.set(0, 0)    // Start at the left edge
  frontTexture.needsUpdate = true

  // Back texture uses the right half of the image
  backTexture.repeat.set(0.49, 1)  // Use half the width, full height
  backTexture.offset.set(0.5, 0)   // Offset to start at the middle
  backTexture.needsUpdate = true

  // Material settings: transparent to hide parts without texture
  const materialProps = {
    transparent: true,
    alphaTest: 0.5,
  }

  return (
    <group {...props}>
      {/* Front side */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          map={frontTexture}
          side={THREE.FrontSide}
          {...materialProps}
        />
      </mesh>

      {/* Back side (rotated 180 degrees) */}
      <mesh rotation={[0, Math.PI, 0]} position={[0, 0, -0.01]}>
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial
          map={backTexture}
          side={THREE.FrontSide}
          {...materialProps}
        />
      </mesh>
    </group>
  )
}
