import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ShapeProps {
  position: [number, number, number]
  geo: 'ico' | 'torus' | 'sphere'
  color: string
  wireframe: boolean
  speed: number
  rotX: number
  rotY: number
  scale: number
  opacity: number
}

function Shape({ position, geo, color, wireframe, speed, rotX, rotY, scale, opacity }: ShapeProps) {
  const ref = useRef<THREE.Mesh>(null!)
  const initY = position[1]
  const offset = useMemo(() => Math.random() * Math.PI * 2, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    ref.current.rotation.x += rotX
    ref.current.rotation.y += rotY
    ref.current.position.y = initY + Math.sin(t * speed + offset) * 0.5
  })

  return (
    <mesh ref={ref} position={position} scale={scale}>
      {geo === 'ico'    && <icosahedronGeometry args={[1, 0]} />}
      {geo === 'torus'  && <torusGeometry args={[1, 0.35, 8, 20]} />}
      {geo === 'sphere' && <sphereGeometry args={[1, 8, 8]} />}
      <meshBasicMaterial color={color} wireframe={wireframe} transparent opacity={opacity} />
    </mesh>
  )
}

const SHAPES: ShapeProps[] = [
  { position: [-6, 2, -5],   geo: 'ico',    color: '#1E3A8A', wireframe: true,  speed: 0.4,  rotX: 0.004, rotY: 0.006, scale: 1.4, opacity: 0.65 },
  { position: [6, -1, -6],   geo: 'ico',    color: '#7C3AED', wireframe: true,  speed: 0.3,  rotX: 0.003, rotY: 0.005, scale: 1.0, opacity: 0.55 },
  { position: [0, 3.5, -8],  geo: 'ico',    color: '#F59E0B', wireframe: true,  speed: 0.5,  rotX: 0.005, rotY: 0.004, scale: 1.6, opacity: 0.45 },
  { position: [5, 2.5, -7],  geo: 'torus',  color: '#7C3AED', wireframe: false, speed: 0.25, rotX: 0.006, rotY: 0.003, scale: 1.2, opacity: 0.16 },
  { position: [-5, -2, -8],  geo: 'torus',  color: '#F59E0B', wireframe: false, speed: 0.4,  rotX: 0.004, rotY: 0.005, scale: 0.9, opacity: 0.18 },
  { position: [1, -2, -9],   geo: 'sphere', color: '#7C3AED', wireframe: false, speed: 0.2,  rotX: 0.001, rotY: 0.005, scale: 2.0, opacity: 0.08 },
]

function Scene() {
  return <>{SHAPES.map((s, i) => <Shape key={i} {...s} />)}</>
}

export default function Background3D({ isDark }: { isDark: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 60 }}
      dpr={[1, 1]}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: true }}
    >
      <color attach="background" args={[isDark ? '#030712' : '#EEF2FF']} />
      <Scene />
    </Canvas>
  )
}
