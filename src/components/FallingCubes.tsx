import React, { useRef, useMemo, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Edges } from "@react-three/drei"
import { KAMI_THEME } from '../theme'
import { GRID_CONFIG } from '../config'

function FallingCube({ targetPos, delay, active, size }: {
  targetPos: [number, number, number],
  delay: number,
  active: boolean,
  size: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const startTime = useRef<number | null>(null)

  // 物理状态：当前位置、速度
  const physics = useRef({
    z: 100,
    vel: 0,
    landed: false
  })

  useFrame((state, delta) => {
    if (!meshRef.current) return

    const targetZ = size + 0.1 // 增加微小空隙，防止边缘遮挡
    const gravity = -30
    const bounce = 0.3

    if (active) {
      // 记录进入页面的时间点
      if (startTime.current === null) {
        startTime.current = state.clock.getElapsedTime()
      }

      const elapsed = state.clock.getElapsedTime() - startTime.current

      // 只有超过了 delay 才开始下坠
      if (elapsed > delay && !physics.current.landed) {
        // 加速下坠
        physics.current.vel += gravity * delta
        physics.current.z += physics.current.vel

        // 碰撞检测
        if (physics.current.z < targetZ) {
          physics.current.z = targetZ
          physics.current.vel = -physics.current.vel * bounce

          if (Math.abs(physics.current.vel) < 0.5) {
            physics.current.landed = true
          }
        }
      }
    } else {
      // 重置状态
      startTime.current = null
      physics.current.z = THREE.MathUtils.lerp(physics.current.z, 100, 0.1)
      physics.current.vel = 0
      physics.current.landed = false
    }

    meshRef.current.position.set(targetPos[0], targetPos[1], physics.current.z)

    // 落地瞬间的旋转抖动
    if (physics.current.z === targetZ && !physics.current.landed && active) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 20) * 0.1
    } else {
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1)
    }
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[size, size, size]} />
      <meshBasicMaterial color={KAMI_THEME.colors.parchment} />
      <Edges
        threshold={15}
        color="#c5a059"
        renderOrder={100}
        scale={1.002}
      >
        <lineBasicMaterial transparent opacity={0.8} />
      </Edges>
    </mesh>
  )
}

export function FallingCubes({ activeSection }: { activeSection: number }) {
  const { step, size } = GRID_CONFIG
  const isActive = activeSection === 2

  return (
    <group>
      <FallingCube
        active={isActive}
        delay={0.1}
        targetPos={[step * 1.5, step * 1, 1]}
        size={size}
      />
      <FallingCube
        active={isActive}
        delay={0.8}
        targetPos={[step * 2, -step * 1, 1]}
        size={size}
      />
    </group>
  )
}
