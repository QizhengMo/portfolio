import React, { useMemo, useState, Suspense } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OrthographicCamera, Edges, PerspectiveCamera, OrbitControls, Text } from "@react-three/drei"

const SHOW_DEBUG = false // 全局 Debug 标志

const GridBox = React.memo(({ position, size, gridX, gridY, showDebug }: {
  position: [number, number, number],
  size: number,
  gridX: number,
  gridY: number,
  showDebug: boolean
}) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color="#2f74c0" />
      <Edges
        threshold={15}
        color="white"
        renderOrder={100}
        scale={1.002}
      >
        <lineBasicMaterial polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-4} depthTest={true} />
      </Edges>
      {showDebug && (
        <Text
          position={[0, 0, size / 2 + 0.05]}
          fontSize={size * 0.2}
          color="white"
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
  const { viewport } = useThree()

  // 设置方块大小和间隙
  const boxSize = 5;
  const step = 5;

  // 根据 viewport（视口世界单位）计算行列, 请勿修改
  const columns = Math.floor(viewport.width / step)
  const rows = Math.floor(viewport.height / step)

  const boxes = useMemo(() => {
    const temp = []
    // 居中偏移计算
    const offsetX = (columns - 1) * step / 2
    const offsetY = (rows - 1) * step / 2

    // 配置需要去掉的方块索引
    // 这里使用函数判断，可以支持绝对坐标或相对坐标（如四个角）
    const checkExcluded = (x: number, y: number, cols: number, rs: number) => {
      const excluded = [[0, rs - 1], [1, rs - 1]]
      return excluded.some(([ex, ey]) => x === ex && y === ey)
    }

    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        if (!checkExcluded(x, y, columns, rows)) {
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
  }, [columns, rows, step])

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
  useFrame((state) => {
    if (!active) return

    // 基础参数
    const basePos = new THREE.Vector3(0.25, -44.52, 26.80)
    const baseRot = new THREE.Euler(1.03, 0.00, -0.01)

    // 根据鼠标位置计算目标位置偏移（微调 x 和 y）
    // 鼠标在 viewport 中心时 state.mouse 为 (0,0)，边缘为 (-1, 1)
    const targetPos = new THREE.Vector3(
      basePos.x + state.mouse.x * 2,
      basePos.y + state.mouse.y * 2,
      basePos.z
    )

    // 平滑插值
    state.camera.position.lerp(targetPos, 0.05)

    // 稍微改变一点旋转角度来增强倾斜感
    state.camera.rotation.x = THREE.MathUtils.lerp(state.camera.rotation.x, baseRot.x - state.mouse.y * 0.05, 0.05)
    state.camera.rotation.y = THREE.MathUtils.lerp(state.camera.rotation.y, baseRot.y + state.mouse.x * 0.05, 0.05)
  })
  return null
}

export default function App() {
  const [isFreeCamera, setIsFreeCamera] = useState(false)

  return (
    <div className="fixed inset-0 w-full h-full bg-[#050505] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-5 right-5 z-[1000] flex gap-2.5">
        <button
          onClick={() => setIsFreeCamera(!isFreeCamera)}
          className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-lg cursor-pointer text-sm font-medium transition-all duration-300 shadow-2xl hover:bg-white/20"
        >
          {isFreeCamera ? 'Perspective' : 'Orthographic'}
        </button>
      </div>

      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={null}>
          {isFreeCamera ? (
            <PerspectiveCamera
              makeDefault
              position={[0.25, -44.52, 26.80]}
              rotation={[1.03, 0.00, -0.01]}
              fov={50}
            />
          ) : (
            <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={30} />
          )}

          <ambientLight intensity={0.8} />
          <pointLight position={[20, 20, 20]} intensity={2} />

          <CameraRig active={isFreeCamera} />
          <BoxGrid showDebug={SHOW_DEBUG} />
        </Suspense>
      </Canvas>
    </div>
  )
}