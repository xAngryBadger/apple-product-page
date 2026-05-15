import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useScrollProgress, useCursorWorld } from '../../hooks/useScrollProgress'

const AMBER = new THREE.Color('#a8611a')
const SAGE = new THREE.Color('#456a4b')
const WHITE = new THREE.Color('#e8e8e8')
const AMBER_LIGHT = new THREE.Color('#d4882a')

const NEAR = { min: 1.5, max: 2.5, scrollMult: 1.5, size: 0.022, count: 600 }
const MID = { min: 2.5, max: 4.0, scrollMult: 1.0, size: 0.016, count: 700 }
const FAR = { min: 4.0, max: 7.0, scrollMult: 0.5, size: 0.01, count: 700 }
const LAYERS = [NEAR, MID, FAR]

function createStarPositions(count: number, minR: number, maxR: number) {
  const pos = new Float32Array(count * 3)
  const originals = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    const r = minR + Math.random() * (maxR - minR)
    const x = r * Math.sin(phi) * Math.cos(theta)
    const y = r * Math.sin(phi) * Math.sin(theta)
    const z = r * Math.cos(phi)
    pos[i * 3] = x
    pos[i * 3 + 1] = y
    pos[i * 3 + 2] = z
    originals[i * 3] = x
    originals[i * 3 + 1] = y
    originals[i * 3 + 2] = z
  }
  return { pos, originals }
}

interface StarLayerProps {
  count: number
  minR: number
  maxR: number
  scrollMult: number
  size: number
}

function StarLayer({ count, minR, maxR, scrollMult, size }: StarLayerProps) {
  const ref = useRef<THREE.Points>(null)
  const matRef = useRef<THREE.PointsMaterial>(null)
  const scrollProgress = useScrollProgress()
  const cursorWorld = useCursorWorld()

  const { pos, originals } = useMemo(() => createStarPositions(count, minR, maxR), [count, minR, maxR])

  useFrame((_, delta) => {
    if (!ref.current) return
    const p = scrollProgress.current

    ref.current.rotation.y += delta * 0.04 * (1 + p * 0.5) * scrollMult
    ref.current.rotation.x += delta * 0.015 * scrollMult

    if (cursorWorld.current.active) {
      const positions = ref.current.geometry.attributes.position.array as Float32Array
      const cx = cursorWorld.current.x * 4
      const cy = cursorWorld.current.y * 4
      const repelR = 1.2
      for (let i = 0; i < count; i++) {
        const idx = i * 3
        const dx = positions[idx] - cx
        const dy = positions[idx + 1] - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < repelR && dist > 0.01) {
          const force = (1 - dist / repelR) * 0.15
          positions[idx] += (dx / dist) * force
          positions[idx + 1] += (dy / dist) * force
        } else {
          positions[idx] += (originals[idx] - positions[idx]) * 0.02
          positions[idx + 1] += (originals[idx + 1] - positions[idx + 1]) * 0.02
          positions[idx + 2] += (originals[idx + 2] - positions[idx + 2]) * 0.02
        }
      }
      ref.current.geometry.attributes.position.needsUpdate = true
    }

    if (matRef.current) {
      const color = new THREE.Color()
      if (p < 0.3) {
        color.copy(AMBER)
      } else if (p < 0.5) {
        color.lerpColors(AMBER, AMBER_LIGHT, (p - 0.3) / 0.2)
      } else if (p < 0.7) {
        color.lerpColors(AMBER_LIGHT, SAGE, (p - 0.5) / 0.2)
      } else {
        color.lerpColors(SAGE, WHITE, (p - 0.7) / 0.3)
      }
      matRef.current.color.copy(color)
    }
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[pos, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        color="#a8611a"
        size={size}
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function ConstellationLines() {
  const ref = useRef<THREE.LineSegments>(null)
  const scrollProgress = useScrollProgress()

  /* eslint-disable react-hooks/purity */
  const { positions } = useMemo(() => {
    const count = 200
    const stars: THREE.Vector3[] = []
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 1.5 + Math.random() * 4
      stars.push(new THREE.Vector3(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi),
      ))
    }

    const pos: number[] = []
    const maxDist = 1.8
    for (let i = 0; i < count; i++) {
      const dists: { idx: number; d: number }[] = []
      for (let j = i + 1; j < count; j++) {
        const d = stars[i].distanceTo(stars[j])
        if (d < maxDist) dists.push({ idx: j, d })
      }
      dists.sort((a, b) => a.d - b.d)
      const neighbors = dists.slice(0, 2)
      for (const n of neighbors) {
        pos.push(stars[i].x, stars[i].y, stars[i].z)
        pos.push(stars[n.idx].x, stars[n.idx].y, stars[n.idx].z)
      }
    }

    return { positions: new Float32Array(pos) }
  }, [])
  /* eslint-enable react-hooks/purity */

  const matRef = useRef<THREE.LineBasicMaterial>(null)

  useFrame(() => {
    if (!matRef.current) return
    const p = scrollProgress.current
    const baseOpacity = 0.04
    const pulseZone = p > 0.15 && p < 0.4
    const pulse = pulseZone ? 0.12 + Math.sin(Date.now() * 0.003) * 0.06 : 0
    matRef.current.opacity = baseOpacity + pulse
  })

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        ref={matRef}
        color="#a8611a"
        transparent
        opacity={0.04}
        depthWrite={false}
      />
    </lineSegments>
  )
}

const nebulaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const nebulaFragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p *= 2.0;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float n = fbm(uv * 3.0 + uTime * 0.05);
    float n2 = fbm(uv * 5.0 - uTime * 0.03 + 100.0);
    float combined = n * 0.6 + n2 * 0.4;
    float alpha = smoothstep(0.3, 0.7, combined) * uOpacity;
    gl_FragColor = vec4(uColor, alpha);
  }
`

function NebulaCloud({
  position,
  color,
  opacity = 0.04,
  scale = 8,
  timeOffset = 0,
}: {
  position: [number, number, number]
  color: string
  opacity?: number
  scale?: number
  timeOffset?: number
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const scrollProgress = useScrollProgress()

  useFrame(({ clock }) => {
    if (!matRef.current) return
    matRef.current.uniforms.uTime.value = clock.getElapsedTime() + timeOffset
    const p = scrollProgress.current
    const fadeIn = p > 0.1 ? Math.min((p - 0.1) / 0.2, 1) : 0
    matRef.current.uniforms.uOpacity.value = opacity * fadeIn
  })

  return (
    <mesh position={position} scale={scale}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={nebulaVertexShader}
        fragmentShader={nebulaFragmentShader}
        transparent
        depthWrite={false}
        side={THREE.DoubleSide}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color(color) },
          uOpacity: { value: 0 },
        }}
      />
    </mesh>
  )
}

const holoVertexShader = `
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    vUv = uv;
    gl_Position = projectionMatrix * mvPos;
  }
`

const holoFragmentShader = `
  uniform vec3 uColor;
  uniform float uTime;
  uniform float uDistort;
  uniform float uFresnelPower;
  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying vec2 vUv;

  void main() {
    float fresnel = pow(1.0 - dot(vNormal, vViewDir), uFresnelPower);
    vec3 iridescence = vec3(
      sin(uTime * 0.5 + vUv.y * 6.28) * 0.5 + 0.5,
      sin(uTime * 0.5 + vUv.y * 6.28 + 2.09) * 0.5 + 0.5,
      sin(uTime * 0.5 + vUv.y * 6.28 + 4.19) * 0.5 + 0.5
    );
    vec3 baseColor = mix(uColor, iridescence, 0.15);
    vec3 rimColor = mix(uColor, iridescence, 0.4);
    vec3 finalColor = mix(baseColor * 0.3, rimColor, fresnel);
    float alpha = 0.6 + fresnel * 0.4;
    gl_FragColor = vec4(finalColor, alpha);
  }
`

function HolographicCore() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const scrollProgress = useScrollProgress()

  const uniforms = useMemo(() => ({
    uColor: { value: AMBER.clone() },
    uTime: { value: 0 },
    uDistort: { value: 0 },
    uFresnelPower: { value: 2.5 },
  }), [])

  useFrame(({ clock }) => {
    if (!matRef.current) return
    const p = scrollProgress.current
    const t = clock.getElapsedTime()

    matRef.current.uniforms.uTime.value = t
    matRef.current.uniforms.uDistort.value = p

    if (meshRef.current) {
      meshRef.current.rotation.z += 0.002
      meshRef.current.rotation.x += 0.001
      const scale = 1.0 + p * 0.2
      meshRef.current.scale.setScalar(scale)
    }

    if (wireRef.current) {
      wireRef.current.rotation.z += 0.002
      wireRef.current.rotation.x += 0.001
      wireRef.current.scale.setScalar((1.0 + p * 0.2) * 1.01)
    }

    if (glowRef.current) {
      const pulse = 0.5 + Math.sin(t * 1.5) * 0.15
      ;(glowRef.current.material as THREE.MeshBasicMaterial).opacity = pulse * 0.15
      glowRef.current.scale.setScalar(0.6 + Math.sin(t * 0.8) * 0.05)
    }

    if (p < 0.3) {
      matRef.current.uniforms.uColor.value.copy(AMBER)
    } else if (p < 0.5) {
      matRef.current.uniforms.uColor.value.lerpColors(AMBER, AMBER_LIGHT, (p - 0.3) / 0.2)
    } else if (p < 0.7) {
      matRef.current.uniforms.uColor.value.lerpColors(AMBER_LIGHT, SAGE, (p - 0.5) / 0.2)
    } else {
      matRef.current.uniforms.uColor.value.lerpColors(SAGE, WHITE, (p - 0.7) / 0.3)
    }
  })

  return (
    <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.6}>
      <group>
        <mesh ref={meshRef} scale={1.0}>
          <icosahedronGeometry args={[1, 2]} />
          <shaderMaterial
            ref={matRef}
            vertexShader={holoVertexShader}
            fragmentShader={holoFragmentShader}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
            uniforms={uniforms}
          />
        </mesh>

        <mesh ref={wireRef} scale={1.01}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial color="#a8611a" wireframe transparent opacity={0.15} />
        </mesh>

        <mesh ref={glowRef} scale={0.6}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial color="#d4882a" transparent opacity={0.1} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
    </Float>
  )
}

function ShootingStars() {
  const groupRef = useRef<THREE.Group>(null)
  const stars = useRef<{ mesh: THREE.Mesh; vel: THREE.Vector3; life: number; maxLife: number }[]>([])

  const geometry = useMemo(() => new THREE.SphereGeometry(0.02, 4, 4), [])

  useEffect(() => {
    if (!groupRef.current) return
    for (let i = 0; i < 3; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: AMBER_LIGHT,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(geometry, mat)
      mesh.position.set(0, 0, -100)
      groupRef.current.add(mesh)
      stars.current.push({
        mesh,
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 0,
      })
    }
  }, [geometry])

  useFrame((_, delta) => {
    for (const star of stars.current) {
      if (star.life <= 0) {
        if (Math.random() < 0.003) {
          const theta = Math.random() * Math.PI * 2
          const phi = Math.random() * Math.PI
          const r = 3 + Math.random() * 2
          star.mesh.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            r * Math.sin(phi) * Math.sin(theta),
            r * Math.cos(phi),
          )
          star.vel.set(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
          )
          star.maxLife = 0.8 + Math.random() * 0.6 // eslint-disable-line react-hooks/immutability
          star.life = star.maxLife
        }
      } else {
        star.life -= delta
        const progress = 1 - star.life / star.maxLife
        star.mesh.position.addScaledVector(star.vel, delta * 2)
        ;(star.mesh.material as THREE.MeshBasicMaterial).opacity = Math.sin(progress * Math.PI) * 0.8
        if (star.life <= 0) {
          ;(star.mesh.material as THREE.MeshBasicMaterial).opacity = 0
          star.mesh.position.set(0, 0, -100)
        }
      }
    }

  if (groupRef.current) {
    groupRef.current.rotation.y += delta * 0.02
  }
  })

  return <group ref={groupRef} />
}

function CameraDolly() {
  const { camera } = useThree()
  const scrollProgress = useScrollProgress()

  const targetZ = useRef(5)

  // eslint-disable-next-line react-hooks/immutability
  useFrame(() => {
    const p = scrollProgress.current
    if (p < 0.2) {
      targetZ.current = 5
    } else if (p < 0.4) {
      targetZ.current = 5 - (p - 0.2) / 0.2 * 2
    } else if (p < 0.6) {
      targetZ.current = 3 - (p - 0.4) / 0.2 * 1
    } else if (p < 0.8) {
      targetZ.current = 2 - (p - 0.6) / 0.2 * 0.5
    } else {
      targetZ.current = 1.5 - (p - 0.8) / 0.2 * 0.3
    }

    // eslint-disable-next-line react-hooks/immutability
    camera.position.z += (targetZ.current - camera.position.z) * 0.05
    camera.position.y = Math.sin(Date.now() * 0.0003) * 0.15
  })

  return null
}

export function CosmosScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fafafa" />
      <directionalLight position={[-3, -3, 2]} intensity={0.4} color="#a8611a" />
      <pointLight position={[0, 0, 3]} intensity={0.6} color="#d4882a" />

      <CameraDolly />

      {LAYERS.map((layer, i) => (
        <StarLayer
          key={i}
          count={layer.count}
          minR={layer.min}
          maxR={layer.max}
          scrollMult={layer.scrollMult}
          size={layer.size}
        />
      ))}

      <ConstellationLines />

      <NebulaCloud position={[-4, 2, -3]} color="#a8611a" opacity={0.035} scale={8} timeOffset={0} />
      <NebulaCloud position={[3, -1, -5]} color="#456a4b" opacity={0.03} scale={10} timeOffset={50} />
      <NebulaCloud position={[1, 3, -4]} color="#6b3fa0" opacity={0.02} scale={7} timeOffset={100} />

      <HolographicCore />

      <ShootingStars />

      <OrbitRing radius={2.2} speed={0.25} color="#a8611a" tilt={Math.PI * 0.1} />
      <OrbitRing radius={2.8} speed={-0.15} color="#d4882a" tilt={Math.PI * 0.35} />
      <OrbitRing radius={3.4} speed={0.1} color="#456a4b" tilt={Math.PI * 0.55} />
    </>
  )
}

function OrbitRing({ radius, speed, color, tilt }: { radius: number; speed: number; color: string; tilt: number }) {
  const ref = useRef<THREE.Mesh>(null)
  const matRef = useRef<THREE.MeshBasicMaterial>(null)
  const scrollProgress = useScrollProgress()

  useFrame((_, delta) => {
    if (!ref.current) return
    ref.current.rotation.z += delta * speed
    if (matRef.current) {
      const p = scrollProgress.current
      matRef.current.opacity = p < 0.5 ? 0.2 : 0.2 * (1 - (p - 0.5) / 0.5)
    }
  })

  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.003, 8, 128]} />
      <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.2} />
    </mesh>
  )
}
