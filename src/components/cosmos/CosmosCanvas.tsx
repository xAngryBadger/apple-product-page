import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { CosmosScene } from './CosmosScene'

export function CosmosCanvas() {
  return (
    <div className="fixed inset-0 z-0" style={{ pointerEvents: 'none' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', pointerEvents: 'auto' }}
      >
        <Suspense fallback={null}>
          <CosmosScene />
        </Suspense>
      </Canvas>
    </div>
  )
}
