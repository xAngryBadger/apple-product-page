import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { GeometricObject } from './GeometricObject'

export function HeroCanvas() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} color="#fafafa" />
        <directionalLight position={[-3, -3, 2]} intensity={0.5} color="#a8611a" />
        <pointLight position={[0, 0, 3]} intensity={0.8} color="#d4882a" />
        <Suspense fallback={null}>
          <GeometricObject />
        </Suspense>
      </Canvas>
    </div>
  )
}
