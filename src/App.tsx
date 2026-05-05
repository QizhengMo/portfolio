import React, { useMemo, useState, Suspense, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Edges, PerspectiveCamera, Text } from "@react-three/drei"

// 引入主题和配置
import { KAMI_THEME } from './theme'
import { GRID_CONFIG, CAMERA_CONFIG, SHOW_DEBUG } from './config'

// 引入章节组件
import Work from './sections/Work'
import About from './sections/About'
import Contact from './sections/Contact'

// --- 子组件 ---

const GridBox = React.memo(({ position, size, gridX, gridY, showDebug }: {
  position: [number, number, number],
  size: number,
  gridX: number,
  gridY: number,
  showDebug: boolean
}) => {
  const [hovered, setHover] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame(() => {
    if (!meshRef.current) return
    const targetZ = hovered ? 0.8 : 0
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1)
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={(e) => { e.stopPropagation(); setHover(true) }}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={KAMI_THEME.colors.parchment}
        roughness={0.8}
        metalness={0.1}
      />
      <Edges
        threshold={15}
        color={hovered ? KAMI_THEME.colors.brand : KAMI_THEME.colors.olive}
        renderOrder={100}
        scale={1.002}
      >
        <lineBasicMaterial polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} depthTest={true} />
      </Edges>
      {showDebug && (
        <Text
          position={[0, 0, size / 2 + 0.05]}
          fontSize={size * 0.2}
          color={KAMI_THEME.colors.olive}
          anchorX="center"
          anchorY="middle"
        >
          {`${gridX},${gridY}`}
        </Text>
      )}
    </mesh>
  )
})

function BoxGrid({ showDebug }: { showDebug: boolean }) {
  const { size } = useThree()
  const { step, size: boxSize, zoomReference, excluded } = GRID_CONFIG

  const columns = Math.floor(size.width / (zoomReference * step))
  const rows = Math.floor(size.height / (zoomReference * step))

  const boxes = useMemo(() => {
    const temp = []
    const offsetX = (columns - 1) * step / 2
    const offsetY = (rows - 1) * step / 2

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        if (!excluded(x, y, columns, rows)) {
          temp.push({
            id: `${x}-${y}`,
            gridX: x,
            gridY: y,
            pos: [x * step - offsetX, y * step - offsetY, 0] as [number, number, number]
          })
        }
      }
    }
    return temp
  }, [columns, rows, step, excluded])

  return (
    <group>
      {boxes.map((box) => (
        <GridBox
          key={box.id}
          position={box.pos}
          size={boxSize}
          gridX={box.gridX}
          gridY={box.gridY}
          showDebug={showDebug}
        />
      ))}
    </group>
  )
}

function CameraRig({ isFreeCamera }: { isFreeCamera: boolean }) {
  const { ortho, persp, transitionStep } = CAMERA_CONFIG

  useFrame((state) => {
    const target = isFreeCamera ? persp.target : ortho
    const mouseIntensity = isFreeCamera ? 1 : 0
    const targetPos = new THREE.Vector3(
      target.pos.x + state.mouse.x * 2 * mouseIntensity,
      target.pos.y + state.mouse.y * 2 * mouseIntensity,
      target.pos.z
    )

    state.camera.position.lerp(targetPos, transitionStep)
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, target.rot.x - state.mouse.y * 0.05 * mouseIntensity, transitionStep)
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, target.rot.y + state.mouse.x * 0.05 * mouseIntensity, transitionStep)
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, target.rot.z, transitionStep)

    const cam = state.camera as THREE.PerspectiveCamera
    cam.fov = THREE.MathUtils.lerp(cam.fov, target.fov, transitionStep)
    cam.updateProjectionMatrix()
  })
  return null
}

// --- 主应用 ---

export default function App() {
  const [activeSection, setActiveSection] = useState(0)
  const sectionList = [
    { name: 'About', Component: About },
    { name: 'Work', Component: Work },
    { name: 'Contact', Component: Contact }
  ]
  const { ortho } = CAMERA_CONFIG

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop
    const height = e.currentTarget.clientHeight
    const index = Math.round(scrollTop / height)
    if (index !== activeSection) {
      setActiveSection(index)
    }
  }

  // 只有在最后一页 (Contact) 时开启 Perspective
  const isFreeCamera = activeSection === 2

  return (
    <div className="fixed inset-0 w-full h-full bg-[var(--kami-parchment)] overflow-hidden">
      {/* 3D 背景 */}
      <div className="absolute inset-0 z-0">
        <Canvas
          dpr={[1, 2]}
          gl={{ antialias: true, logarithmicDepthBuffer: true }}
          className="bg-[var(--kami-parchment)]"
        >
          <Suspense fallback={null}>
            <PerspectiveCamera makeDefault position={ortho.pos} fov={ortho.fov} />
            <ambientLight intensity={3} color={KAMI_THEME.colors.parchment} />
            <pointLight position={[20, 20, 20]} intensity={1} color="#fff" />
            <CameraRig isFreeCamera={isFreeCamera} />
            <BoxGrid showDebug={SHOW_DEBUG} />
          </Suspense>
        </Canvas>
      </div>

      {/* 内容层 */}
      <div
        className="absolute inset-0 z-10 overflow-y-auto scroll-smooth snap-y snap-mandatory"
        onScroll={handleScroll}
      >
        {sectionList.map(({ name, Component }, i) => (
          <div key={name} id={`section-${i}`}>
            <Component />
          </div>
        ))}
      </div>

      {/* 导航菜单 */}
      <div className="absolute bottom-12 right-12 z-[1000] flex flex-col items-end gap-8 text-right">
        <nav className="flex flex-col items-end gap-4">
          {sectionList.map((section, i) => (
            <button
              key={section.name}
              onClick={() => {
                document.getElementById(`section-${i}`)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="group flex items-center gap-4 cursor-pointer"
            >
              <span className={`text-xs font-medium tracking-[0.2em] uppercase transition-all duration-500 ${activeSection === i ? 'text-[var(--kami-brand)]' : 'text-[var(--kami-brand)] opacity-30 group-hover:opacity-60'
                }`}>
                {section.name}
              </span>
              <div className={`h-[1px] bg-[var(--kami-brand)] transition-all duration-500 ${activeSection === i ? 'w-12' : 'w-4 opacity-30 group-hover:w-8'
                }`} />
            </button>
          ))}
        </nav>
        <div className="serif text-3xl text-[var(--kami-brand)] opacity-20 italic">
          0{activeSection + 1}
        </div>
      </div>
    </div>
  )
}