import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera } from "@react-three/drei"
import * as THREE from 'three'

import { KAMI_THEME } from '../theme'
import { CAMERA_CONFIG, SHOW_DEBUG } from '../config'
import { GridBackground } from './GridBackground'
import { CameraRig, MarginSync } from './SceneLogic'

interface ExperienceProps {
  activeSection: number
  setGridMargin: (m: number) => void
  gridGroupRef: React.RefObject<THREE.Group>
}

export function Experience({ activeSection, setGridMargin, gridGroupRef }: ExperienceProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      eventSource={window as any}
      eventPrefix="client"
      gl={{ 
        antialias: true, 
        logarithmicDepthBuffer: true,
        toneMapping: THREE.NoToneMapping 
      }}
      className="bg-[var(--kami-parchment)]"
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault position={[0, 0, 70]} fov={25} />
        <ambientLight intensity={3} color={KAMI_THEME.colors.parchment} />
        <pointLight position={[20, 20, 20]} intensity={1} color="#fff" />
        <CameraRig activeSection={activeSection} />
        <GridBackground showDebug={SHOW_DEBUG} groupRef={gridGroupRef} />
        <MarginSync setMargin={setGridMargin} targetRef={gridGroupRef} />
      </Suspense>
    </Canvas>
  )
}
