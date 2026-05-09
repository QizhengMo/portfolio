import React, { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBox, Edges } from "@react-three/drei"
import { GRID_CONFIG } from '../config'
import { KAMI_THEME } from '../theme'

// 单个魔方块，完全解耦
const CubePiece = React.forwardRef(({ size }: { size: number }, ref: any) => {
  return (
    <group ref={ref}>
      <RoundedBox args={[size, size, size]} radius={0.12} smoothness={4}>
        <meshPhysicalMaterial
          color="#ffffff"
          transparent
          opacity={0.9}
          transmission={0.8}
          thickness={1}
          roughness={0.1}
          metalness={0.1}
          ior={1.45}
        />
        <Edges color={KAMI_THEME.colors.brand} opacity={0.15} transparent />
      </RoundedBox>
    </group>
  )
})

export function RubiksCube({ active, activeSection }: { active: boolean, activeSection: number }) {
  const groupRef = useRef<THREE.Group>(null)
  const pieceRefs = useRef<THREE.Group[]>([])

  const pieceSize = GRID_CONFIG.size * (1.5 / 3)
  const gap = 0.1
  const step = pieceSize + gap

  // 初始化持久化的块数据
  const piecesData = useMemo(() => {
    const temp = []
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          temp.push({
            id: `${x}-${y}-${z}`,
            pos: new THREE.Vector3(x * step, y * step, z * step),
            quat: new THREE.Quaternion(),
            // 逻辑网格坐标，用于识别切面
            grid: new THREE.Vector3(x, y, z)
          })
        }
      }
    }
    return temp
  }, [step])

  // 动画状态
  const state = useRef({
    queue: [] as { axis: THREE.Vector3, plane: number }[],
    isAnimating: false,
    currentMove: null as { axis: THREE.Vector3, plane: number, progress: number } | null,
    totalRotation: new THREE.Quaternion()
  })

  // 监听切换，压入多个旋转动作
  useEffect(() => {
    if (active) {
      const axes = [new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 1)]
      // 每次切换连拧 3 下
      for (let i = 0; i < 3; i++) {
        state.current.queue.push({
          axis: axes[Math.floor(Math.random() * 3)],
          plane: Math.floor(Math.random() * 3) - 1
        })
      }
    }
  }, [activeSection, active])

  useFrame((sceneState, delta) => {
    if (!groupRef.current) return

    // 1. 基础动效（进入缩放与鼠标跟随转向）
    if (active) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1)
      groupRef.current.position.y = Math.sin(sceneState.clock.elapsedTime * 0.5) * 1.5

      // 鼠标跟随效果：初始朝向更偏向正面 (10度俯角, 15度偏角)
      const targetRotX = Math.PI / 18 - sceneState.mouse.y * 0.25
      const targetRotY = Math.PI / 12 + sceneState.mouse.x * 0.25

      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotX, 0.1)
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1)
    } else {
      groupRef.current.scale.lerp(new THREE.Vector3(0, 0, 0), 0.1)
    }

    // 2. 队列式扭动逻辑
    if (!state.current.isAnimating && state.current.queue.length > 0) {
      const move = state.current.queue.shift()!
      state.current.currentMove = { ...move, progress: 0 }
      state.current.isAnimating = true
    }

    if (state.current.isAnimating && state.current.currentMove) {
      const move = state.current.currentMove
      move.progress += delta * 6 // 旋转速度

      const alpha = Math.min(move.progress, 1)
      // 使用平滑函数让动作更自然
      const ease = 1 - Math.pow(1 - alpha, 3)
      const angle = ease * (Math.PI / 2)

      const rotQuat = new THREE.Quaternion().setFromAxisAngle(move.axis, angle)

      piecesData.forEach((data, i) => {
        const piece = pieceRefs.current[i]
        if (!piece) return

        // 识别属于该切面的方块（利用逻辑网格坐标与轴的点积）
        const isSelected = Math.abs(data.grid.dot(move.axis) - move.plane) < 0.1

        if (isSelected) {
          // 实时应用旋转
          const p = data.pos.clone().applyQuaternion(rotQuat)
          const q = rotQuat.clone().multiply(data.quat)
          piece.position.copy(p)
          piece.quaternion.copy(q)
        } else {
          // 非选择区域保持现状
          piece.position.copy(data.pos)
          piece.quaternion.copy(data.quat)
        }
      })

      if (alpha >= 1) {
        // 动作完成，持久化数据
        const finalRot = new THREE.Quaternion().setFromAxisAngle(move.axis, Math.PI / 2)
        piecesData.forEach((data) => {
          const isSelected = Math.abs(data.grid.dot(move.axis) - move.plane) < 0.1
          if (isSelected) {
            data.pos.applyQuaternion(finalRot)
            data.quat.premultiply(finalRot)
            // 更新逻辑网格坐标，关键点！
            data.grid.applyQuaternion(finalRot).round()
          }
        })
        state.current.isAnimating = false
        state.current.currentMove = null
      }
    } else {
      // 非动画状态，保持方块在最新位置
      piecesData.forEach((data, i) => {
        if (pieceRefs.current[i]) {
          pieceRefs.current[i].position.copy(data.pos)
          pieceRefs.current[i].quaternion.copy(data.quat)
        }
      })
    }
  })

  return (
    <group ref={groupRef} position={[2, 4, 10]} scale={[0, 0, 0]}>
      {piecesData.map((data, i) => (
        <CubePiece
          key={data.id}
          ref={(el: any) => (pieceRefs.current[i] = el)}
          size={pieceSize}
        />
      ))}
    </group>
  )
}
