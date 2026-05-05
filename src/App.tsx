import React, { useMemo, useState, Suspense, useRef, useEffect } from 'react'
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

function BoxGrid({ showDebug, groupRef }: { showDebug: boolean, groupRef: React.RefObject<THREE.Group> }) {
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
    <group ref={groupRef}>
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

// 核心组件：利用 Vector3.project 实时同步 3D 边缘到 2D 像素
function MarginSync({ setMargin, targetRef }: { setMargin: (m: number) => void, targetRef: React.RefObject<THREE.Group> }) {
  const { camera, size } = useThree()
  const box = useMemo(() => new THREE.Box3(), [])

  useFrame(() => {
    if (!targetRef.current) return

    // 1. 获取物体的真实包围盒
    box.setFromObject(targetRef.current)
    const leftEdgeWorldX = box.min.x

    // 2. 将世界坐标投影到屏幕空间 (NDC)
    const vec = new THREE.Vector3(leftEdgeWorldX, 0, 0)
    vec.project(camera)

    // 3. 将 NDC 转换为像素坐标
    const pixelX = (vec.x + 1) * (size.width / 2)

    if (pixelX >= 0) {
      setMargin(pixelX)
    }
  })
  return null
}

// --- 主应用 ---

export default function App() {
  const [activeSection, setActiveSection] = useState(0)
  const [gridMargin, setGridMargin] = useState(48)

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

  const isFreeCamera = activeSection === 2
  const gridGroupRef = useRef<THREE.Group>(null)

  return (
    <div className="fixed inset-0 w-full h-full bg-[var(--kami-parchment)] overflow-hidden">
      {/* 1. Logo - 左上角 (通过 MarginSync 实时同步) */}
      <div
        className="absolute top-20 z-[1000] flex flex-col items-start gap-2"
        style={{ left: `${gridMargin}px` }}
      >
        <div className="serif text-xl font-medium tracking-[0.3em] text-[var(--kami-brand)] uppercase">
          Nathan Mo
        </div>
        <div className="h-[1px] w-12 bg-[var(--kami-brand)] opacity-40" />
      </div>

      {/* 2. 3D 背景 */}
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
            <BoxGrid showDebug={SHOW_DEBUG} groupRef={gridGroupRef} />
            {/* 注入边距同步器，监听真实的网格组 */}
            <MarginSync setMargin={setGridMargin} targetRef={gridGroupRef} />
          </Suspense>
        </Canvas>
      </div>

      {/* 3. 内容层 */}
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

      {/* 4. 导航菜单 (动态对齐) */}
      <div
        className="absolute bottom-12 z-[1000] flex flex-col items-end gap-8 text-right"
        style={{ right: `${gridMargin}px` }}
      >
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