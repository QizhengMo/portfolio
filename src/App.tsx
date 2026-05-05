import React, { useMemo, useState, Suspense, useRef } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Edges, PerspectiveCamera, Text } from "@react-three/drei"

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
}) => {
  const [hovered, setHover] = useState(false)
  const meshRef = useRef<THREE.Mesh>(null)

  // 使用 useFrame 实现平滑的 Z 轴位移（浮雕效果）
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
      {/* 表面颜色与背景一致，模拟纸张浮雕感 */}
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
    // 决定当前的目标
    const target = isFreeCamera ? persp.target : ortho

    // 计算鼠标偏移 (模拟正交模式下禁用鼠标跟随)
    const mouseIntensity = isFreeCamera ? 1 : 0
    const targetPos = new THREE.Vector3(
      target.pos.x + state.mouse.x * 2 * mouseIntensity,
      target.pos.y + state.mouse.y * 2 * mouseIntensity,
      target.pos.z
    )

    // 平滑插值位置
    state.camera.position.lerp(targetPos, transitionStep)

    // 平滑插值旋转
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, target.rot.x - state.mouse.y * 0.05 * mouseIntensity, transitionStep)
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, target.rot.y + state.mouse.x * 0.05 * mouseIntensity, transitionStep)
    state.camera.rotation.z = THREE.MathUtils.lerp(state.camera.rotation.z, target.rot.z, transitionStep)

    // 平滑插值 FOV
    const cam = state.camera as THREE.PerspectiveCamera
    cam.fov = THREE.MathUtils.lerp(cam.fov, target.fov, transitionStep)
    cam.updateProjectionMatrix()
  })
  return null
}

// --- 主应用 ---

export default function App() {
  const [isFreeCamera, setIsFreeCamera] = useState(false)
  const { ortho } = CAMERA_CONFIG

  return (
    <div className="fixed inset-0 w-full h-full bg-[var(--kami-parchment)] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-10 right-10 z-[1000] flex flex-col items-end gap-6">
        <div className="flex flex-col items-end gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--kami-brand)] opacity-50">View Mode</span>
          <button
            onClick={() => setIsFreeCamera(!isFreeCamera)}
            className="px-6 py-2 bg-[var(--kami-brand)] text-[var(--kami-ivory)] border border-[var(--kami-brand)] rounded-[8px] cursor-pointer text-[13px] font-medium transition-all duration-500 shadow-[var(--kami-whisper)] hover:translate-y-[-1px] hover:shadow-md serif tracking-wider"
            style={{ borderRadius: KAMI_THEME.shape.radius.button }}
          >
            {isFreeCamera ? 'PERSPECTIVE' : 'ORTHOGRAPHIC'}
          </button>
        </div>
        <div className="h-[1px] w-12 bg-[var(--kami-brand)] opacity-20" />
      </div>

      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, logarithmicDepthBuffer: true }}
        className="bg-[var(--kami-parchment)]"
      >
        <Suspense fallback={null}>
          {/* 全局仅使用一个透视相机 */}
          <PerspectiveCamera
            makeDefault
            position={ortho.pos}
            fov={ortho.fov}
          />

          <ambientLight intensity={3} color={KAMI_THEME.colors.parchment} />
          <pointLight position={[20, 20, 20]} intensity={1} color="#fff" />

          <CameraRig isFreeCamera={isFreeCamera} />
          <BoxGrid showDebug={SHOW_DEBUG} />
        </Suspense>
      </Canvas>
    </div>
  )
}