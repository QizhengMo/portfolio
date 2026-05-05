import React, { useMemo, useState, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Edges, Text } from "@react-three/drei"
import { KAMI_THEME } from '../theme'
import { GRID_CONFIG } from '../config'

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
    
    // 1. 显著增加升起高度
    const targetZ = hovered ? 2.0 : 0
    
    // 2. 实现非对称插值：升起快，下沉慢
    const lerpSpeed = hovered ? 0.15 : 0.04
    
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z, 
      targetZ, 
      lerpSpeed
    )
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

export function BoxGrid({ showDebug, groupRef }: { showDebug: boolean, groupRef: React.RefObject<THREE.Group> }) {
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
