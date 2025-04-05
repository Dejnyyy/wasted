import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import dynamic from 'next/dynamic'
import Head from 'next/head'

// Dynamically import the ShirtModel component to prevent SSR issues
const ShirtModel = dynamic(() => import('./components/Shirt3DModel'), { ssr: false })

export default function ShirtPage() {
  return (
    <>
      <Head>
        <title>3D Wasted Shirt</title>
      </Head>
      {/* The container div now has a pink gradient background */}
      <div
        style={{
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(180deg, #ff9aa2 0%, #ffcad4 100%)'
        }}
      >
        {/* Enable alpha in the WebGL renderer so the CSS background shows */}
        <Canvas gl={{ alpha: true }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6}>
              <ShirtModel />
            </Stage>
            <OrbitControls enablePan={false} />
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}
