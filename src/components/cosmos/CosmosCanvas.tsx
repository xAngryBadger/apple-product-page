import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, ChromaticAberration, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import * as THREE from 'three'
import { CosmosScene } from './CosmosScene'

export function CosmosCanvas() {
  const chromaticOffset = useMemo(() => new THREE.Vector2(0.0006, 0.0006), [])

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
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <ChromaticAberration
              offset={chromaticOffset}
              radialModulation
              blendFunction={BlendFunction.NORMAL}
            />
            <Vignette offset={0.3} darkness={0.7} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
