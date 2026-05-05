import React, { useMemo, useState, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrthographicCamera, Edges, PerspectiveCamera, Text } from "@react-three/drei"

// 引入主题和配置
import { KAMI_THEME } from './theme'
import { GRID_CONFIG, CAMERA_CONFIG, SHOW_DEBUG } from './config'

// --- 子组件 ---

const GridBox = React.memo(({ position, size, gridX, gridY, showDebug }: {
  position: [number, number, number],
  size: number,
  gridX: number,
  gridY: number,
  showDebug: boolean
}) => (
  <mesh position={position}>
    <boxGeometry args={[size, size, size]} />
    <meshStandardMaterial color={KAMI_THEME.colors.ivory} />
    <Edges
      threshold={15}
      color={KAMI_THEME.colors.brand}
      renderOrder={100}
      scale={1.002}
    >
      <lineBasicMaterial polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} depthTest={true} />
    </Edges>
    {showDebug && (
      <Text
        position={[0, 0, size / 2 + 0.05]}
        fontSize={size * 0.2}
        color={KAMI_THEME.colors.brand}
        anchorX="center"
        anchorY="middle"
      >
        {`${gridX},${gridY}`}
      </Text>
    )}
  </mesh>
))

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

function CameraRig({ active }: { active: boolean }) {
  const { persp, transitionStep } = CAMERA_CONFIG
  
  useFrame((state) => {
    if (!active) return

    const targetPos = new THREE.Vector3(
      persp.target.pos.x + state.mouse.x * 2,
      persp.target.pos.y + state.mouse.y * 2,
      persp.target.pos.z
    )

    state.camera.position.lerp(targetPos, transitionStep)

    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, persp.target.rot.x - state.mouse.y * 0.05, transitionStep)
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, persp.target.rot.y + state.mouse.x * 0.05, transitionStep)
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, persp.target.rot.z, transitionStep)

    if ((state.camera as THREE.PerspectiveCamera).isPerspectiveCamera) {
      const cam = state.camera as THREE.PerspectiveCamera
      cam.fov = THREE.MathUtils.lerp(cam.fov, persp.target.fov, transitionStep)
      cam.updateProjectionMatrix()
    }
  })
  return null
}

// --- 主应用 ---

export default function App() {
  const [isFreeCamera, setIsFreeCamera] = useState(false)
  const { ortho, persp } = CAMERA_CONFIG

  return (
    <div className="fixed inset-0 w-full h-full bg-[var(--kami-parchment)] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-8 right-8 z-[1000] flex flex-col items-end gap-4">
        <button
          onClick={() => setIsFreeCamera(!isFreeCamera)}
          className="px-6 py-2 bg-[var(--kami-brand)] text-[var(--kami-ivory)] border border-[var(--kami-brand)] rounded-sm cursor-pointer text-sm font-medium transition-all duration-500 shadow-sm hover:bg-[var(--kami-ivory)] hover:text-[var(--kami-brand)] serif tracking-wider"
        >
          {isFreeCamera ? 'VIEW PERSPECTIVE' : 'VIEW ORTHOGRAPHIC'}
        </button>
        <div className="h-[1px] w-12 bg-[var(--kami-brand)] opacity-30" />
      </div>

      <Canvas dpr={[1, 2]} gl={{ antialias: true }} className="bg-[var(--kami-parchment)]">
        <Suspense fallback={null}>
          {isFreeCamera ? (
            <PerspectiveCamera
              makeDefault
              position={persp.initial.pos}
              rotation={[0, 0, 0]}
              fov={persp.initial.fov}
            />
          ) : (
            <OrthographicCamera makeDefault position={ortho.pos} zoom={ortho.zoom} />
          )}

          <ambientLight intensity={1.5} color={KAMI_THEME.colors.warmLight} />
          <pointLight position={[20, 20, 20]} intensity={1} color="#fff" />

          <CameraRig active={isFreeCamera} />
          <BoxGrid showDebug={SHOW_DEBUG} />
        </Suspense>
      </Canvas>
    </div>
  )
}