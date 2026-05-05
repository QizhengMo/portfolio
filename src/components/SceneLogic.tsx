import React, { useMemo } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { SCENE_STATES, CAMERA_CONFIG } from '../config'

export function CameraRig({ activeSection }: { activeSection: number }) {
  const { transitionStep } = CAMERA_CONFIG
  
  useFrame((state) => {
    // 根据当前索引获取目标配置，兜底使用第一个状态
    const target = SCENE_STATES[activeSection] || SCENE_STATES[0]
    const { mouseIntensity } = target

    // 计算带鼠标偏移的目标位置
    const targetPos = new THREE.Vector3(
      target.pos.x + state.mouse.x * 2 * mouseIntensity,
      target.pos.y + state.mouse.y * 2 * mouseIntensity,
      target.pos.z
    )

    // 平滑插值：位置
    state.camera.position.lerp(targetPos, transitionStep)
    
    // 平滑插值：旋转
    state.camera.rotation.x = THREE.MathUtils.lerp(
      state.camera.rotation.x, 
      target.rot.x - state.mouse.y * 0.05 * mouseIntensity, 
      transitionStep
    )
    state.camera.rotation.y = THREE.MathUtils.lerp(
      state.camera.rotation.y, 
      target.rot.y + state.mouse.x * 0.05 * mouseIntensity, 
      transitionStep
    )
    state.camera.rotation.z = THREE.MathUtils.lerp(
      state.camera.rotation.z, 
      target.rot.z, 
      transitionStep
    )

    // 平滑插值：FOV
    const cam = state.camera as THREE.PerspectiveCamera
    cam.fov = THREE.MathUtils.lerp(cam.fov, target.fov, transitionStep)
    cam.updateProjectionMatrix()
  })
  return null
}

export function MarginSync({ setMargin, targetRef }: { setMargin: (m: number) => void, targetRef: React.RefObject<THREE.Group> }) {
  const { camera, size } = useThree()
  const box = useMemo(() => new THREE.Box3(), [])

  useFrame(() => {
    if (!targetRef.current) return
    box.setFromObject(targetRef.current)
    const leftEdgeWorldX = box.min.x
    const vec = new THREE.Vector3(leftEdgeWorldX, 0, 0)
    vec.project(camera)
    const pixelX = (vec.x + 1) * (size.width / 2)
    if (pixelX >= 0) {
      setMargin(pixelX)
    }
  })
  return null
}
