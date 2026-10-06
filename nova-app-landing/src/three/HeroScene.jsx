import React, { useMemo, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox, Float, ContactShadows } from '@react-three/drei'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { createScreenTexture, createGlowTexture } from './screenTexture'

/* -------------------------------------------------- environment (no network) */
function EnvSetup() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

/* -------------------------------------------------- the 3D phone */
function Phone({ pointer }) {
  const group = useRef()
  const screenTex = useMemo(() => createScreenTexture(0), [])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const g = group.current
    // continuous cinematic motion + pointer parallax (damped)
    const targetY = Math.sin(t * 0.32) * 0.45 + pointer.current.x * 0.55
    const targetX = Math.sin(t * 0.21) * 0.10 + pointer.current.y * -0.35
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, targetY, 2.2, delta)
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, targetX, 2.2, delta)
    g.position.y = Math.sin(t * 0.8) * 0.09 - 0.1
    // keep screen readable — don't spin to the back
    if (g.rotation.y > Math.PI / 2.1) g.rotation.y = Math.PI / 2.1
    if (g.rotation.y < -Math.PI / 2.1) g.rotation.y = -Math.PI / 2.1
  })

  return (
    <group ref={group} position={[0, -0.1, 0]}>
      {/* titanium body */}
      <RoundedBox args={[2.35, 4.85, 0.24]} radius={0.26} smoothness={8}>
        <meshPhysicalMaterial
          color="#232842"
          metalness={0.92}
          roughness={0.28}
          clearcoat={1}
          clearcoatRoughness={0.15}
        />
      </RoundedBox>
      {/* side buttons */}
      <mesh position={[-1.2, 0.9, 0]}>
        <boxGeometry args={[0.05, 0.5, 0.1]} />
        <meshStandardMaterial color="#3a4060" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[-1.2, 0.2, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.1]} />
        <meshStandardMaterial color="#3a4060" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[1.2, 0.6, 0]}>
        <boxGeometry args={[0.05, 0.7, 0.1]} />
        <meshStandardMaterial color="#3a4060" metalness={0.9} roughness={0.3} />
      </mesh>

      {/* screen (procedural placeholder — swap with real screenshot texture) */}
      <mesh position={[0, 0, 0.126]}>
        <planeGeometry args={[2.16, 4.66]} />
        <meshPhysicalMaterial
          map={screenTex}
          roughness={0.18}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.08}
        />
      </mesh>
      {/* glass reflection overlay */}
      <mesh position={[0, 0, 0.128]}>
        <planeGeometry args={[2.16, 4.66]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.06}
          roughness={0.05}
          metalness={0}
        />
      </mesh>

      {/* camera island */}
      <RoundedBox args={[0.9, 0.9, 0.06]} radius={0.14} position={[-0.55, 1.75, -0.15]}>
        <meshPhysicalMaterial color="#15182c" metalness={0.8} roughness={0.35} />
      </RoundedBox>
      {[[-0.75, 1.95], [-0.35, 1.95], [-0.55, 1.6]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, -0.19]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.05, 32]} />
          <meshPhysicalMaterial color="#05060c" metalness={0.4} roughness={0.1} clearcoat={1} />
        </mesh>
      ))}
    </group>
  )
}

/* -------------------------------------------------- floating glass objects */
function FloatingObject({ position, speed, children, rotationSpeed = 0.4 }) {
  const ref = useRef()
  useFrame((state) => {
    const t = state.clock.elapsedTime
    ref.current.rotation.x = t * rotationSpeed * 0.6
    ref.current.rotation.y = t * rotationSpeed
  })
  return (
    <Float speed={speed} rotationIntensity={0.6} floatIntensity={1.6}>
      <group position={position} ref={ref}>
        {children}
      </group>
    </Float>
  )
}

function OrbitRing() {
  const ref = useRef()
  useFrame((state, delta) => {
    ref.current.rotation.z += delta * 0.25
  })
  return (
    <group rotation={[Math.PI / 2.4, 0.4, 0]}>
      <mesh ref={ref}>
        <torusGeometry args={[3.1, 0.012, 12, 128]} />
        <meshStandardMaterial color="#5b6cff" emissive="#5b6cff" emissiveIntensity={1.4} transparent opacity={0.5} />
      </mesh>
      <mesh position={[3.1, 0, 0]}>
        <sphereGeometry args={[0.07, 24, 24]} />
        <meshStandardMaterial color="#7ef0d4" emissive="#7ef0d4" emissiveIntensity={2} />
      </mesh>
    </group>
  )
}

/* -------------------------------------------------- particles */
function Particles({ count = 220 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = 3.5 + Math.random() * 5
      const theta = Math.random() * Math.PI * 2
      arr[i * 3] = Math.cos(theta) * r
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8
      arr[i * 3 + 2] = Math.sin(theta) * r - 2
    }
    return arr
  }, [count])

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.03
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#9db4ff"
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

/* -------------------------------------------------- glow backdrop */
function GlowBackdrop({ pointer }) {
  const tex = useMemo(() => createGlowTexture(), [])
  const ref = useRef()
  useFrame(() => {
    ref.current.position.x = pointer.current.x * 0.7
    ref.current.position.y = pointer.current.y * 0.5
  })
  return (
    <mesh ref={ref} position={[0, 0, -3.5]}>
      <planeGeometry args={[16, 16]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  )
}

/* -------------------------------------------------- scene root */
export default function HeroScene({ pointer }) {
  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.2, 7.2], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: 'pan-y' }}
    >
      <EnvSetup />
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 6, 5]} intensity={1.6} color="#dfe6ff" />
      <directionalLight position={[-5, -2, 3]} intensity={0.6} color="#7ef0d4" />
      <spotLight position={[0, 6, 2]} angle={0.5} penumbra={1} intensity={2} color="#8fa2ff" />

      <GlowBackdrop pointer={pointer} />
      <Phone pointer={pointer} />
      <OrbitRing />

      {/* floating glass elements — related to the app: focus orb, gem "insight", energy ring */}
      <FloatingObject position={[-3.1, 1.4, -0.6]} speed={1.6}>
        <mesh>
          <icosahedronGeometry args={[0.42, 0]} />
          <meshPhysicalMaterial color="#7ef0d4" transmission={0.9} thickness={1.2} roughness={0.1} ior={1.4} />
        </mesh>
      </FloatingObject>
      <FloatingObject position={[3.2, -1.1, -0.4]} speed={1.2} rotationSpeed={0.25}>
        <mesh>
          <torusKnotGeometry args={[0.32, 0.1, 128, 24]} />
          <meshPhysicalMaterial color="#9db4ff" metalness={0.9} roughness={0.15} clearcoat={1} />
        </mesh>
      </FloatingObject>
      <FloatingObject position={[2.7, 1.9, -1.4]} speed={2}>
        <mesh>
          <octahedronGeometry args={[0.3, 0]} />
          <meshPhysicalMaterial color="#ffd58a" metalness={0.85} roughness={0.2} />
        </mesh>
      </FloatingObject>
      <FloatingObject position={[-2.6, -1.8, -1]} speed={1.8}>
        <mesh>
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshPhysicalMaterial color="#ff8ab0" transmission={0.85} thickness={1} roughness={0.05} />
        </mesh>
      </FloatingObject>

      <Particles />
      <ContactShadows position={[0, -3.1, 0]} opacity={0.55} scale={12} blur={2.6} far={4} color="#05060c" />

      {/* subtle scene-wide drift driven by pointer */}
      <Rig pointer={pointer} />
    </Canvas>
  )
}

function Rig({ pointer }) {
  useFrame((state, delta) => {
    state.camera.position.x = THREE.MathUtils.damp(state.camera.position.x, pointer.current.x * 0.6, 2, delta)
    state.camera.position.y = THREE.MathUtils.damp(state.camera.position.y, 0.2 + pointer.current.y * 0.4, 2, delta)
    state.camera.lookAt(0, 0, 0)
  })
  return null
}
