import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Link from 'next/link'
// Dynamically import the ShirtModel component to prevent SSR issues
const ShirtModel = dynamic(() => import('../components/Shirt3DModel'), { ssr: false })

export default function ShirtPage() {
  const router = useRouter()
  const { shirt } = router.query

  return (
    <>
      <Head>
        <title>3D Wasted Shirt</title>
      </Head>
      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          background: 'linear-gradient(180deg, #ff9aa2 0%, #ffcad4 100%)',
        }}
      >
        {/* Back Button */}
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
        <div className="">
            <Link href={`/`}>
              <p className="inline-block bg-black text-white font-bold rounded-xl border border-pink-500 py-2 px-4 animate-pulse">
                Back
              </p>
            </Link>
          </div>
        </div>

        <Canvas gl={{ alpha: true }}>
          <Suspense fallback={null}>
            <Stage environment="city" intensity={0.6}>
              {/* Pass the shirt image from query params */}
              <ShirtModel shirtImage={typeof shirt === 'string' ? shirt : undefined} />
            </Stage>
            <OrbitControls enablePan={false} />
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}
