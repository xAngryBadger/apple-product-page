import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

export function GeometricObject() {
  const groupRef = useRef<THREE.Group>(null)
  const icoRef = useRef<THREE.Mesh>(null)
  const octRef = useRef<THREE.Mesh>(null)
  const tetRef = useRef<THREE.Mesh>(null)
  const scrollProgress = useRef(0)

  useEffect(() => {
    const handler = (e: Event) => {
      scrollProgress.current = (e as CustomEvent<number>).detail
    }
    window.addEventListener('hero-scroll', handler)
    return () => window.removeEventListener('hero-scroll', handler)
  }, [])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const speed = 0.15 + scrollProgress.current * 0.6
    groupRef.current.rotation.y += delta * speed
    groupRef.current.rotation.x += delta * speed * 0.3

    if (icoRef.current) icoRef.current.rotation.z += delta * 0.1
    if (octRef.current) octRef.current.rotation.x += delta * 0.15
    if (tetRef.current) tetRef.current.rotation.y += delta * 0.2
  })

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
      <group ref={groupRef}>
        <mesh ref={icoRef} scale={1.2}>
          <icosahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#a8611a"
            roughness={0.2}
            metalness={0.8}
            distort={0.15}
            speed={2}
          />
        </mesh>

        <mesh scale={1.2}>
          <icosahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#a8611a" wireframe opacity={0.3} transparent />
        </mesh>

        <mesh ref={octRef} position={[1.4, 0.5, -0.5]} scale={0.55}>
          <octahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#d4882a"
            roughness={0.3}
            metalness={0.7}
            distort={0.2}
            speed={3}
          />
        </mesh>

        <mesh position={[1.4, 0.5, -0.5]} scale={0.55}>
          <octahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#d4882a" wireframe opacity={0.2} transparent />
        </mesh>

        <mesh ref={tetRef} position={[-1.2, -0.7, 0.3]} scale={0.45}>
          <tetrahedronGeometry args={[1, 0]} />
          <MeshDistortMaterial
            color="#fafafa"
            roughness={0.4}
            metalness={0.6}
            distort={0.25}
            speed={4}
          />
        </mesh>

        <mesh position={[-1.2, -0.7, 0.3]} scale={0.45}>
          <tetrahedronGeometry args={[1, 0]} />
          <meshBasicMaterial color="#fafafa" wireframe opacity={0.15} transparent />
        </mesh>
      </group>
    </Float>
  )
}
