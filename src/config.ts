import * as THREE from 'three'

export const GRID_CONFIG = {
  size: 4.98,
  step: 5,
  zoomReference: 30,
  excluded: (x: number, y: number, cols: number, rows: number) => {
    const corners = [[0, rows - 1], [1, rows - 1], [cols - 1, 0], [cols - 2, 0]]
    return corners.some(([ex, ey]) => x === ex && y === ey)
  }
}

// 语义化的场景状态
export const SCENE_STATES = {
  about: {
    pos: new THREE.Vector3(0, 0, 70),
    rot: new THREE.Euler(0, 0, 0),
    fov: 25,
    mouseIntensity: 0
  },
  work: {
    pos: new THREE.Vector3(15, 5, 65), // 向右偏移更多
    rot: new THREE.Euler(-0.1, 0.45, 0.05), // 剧烈的左侧纵深
    fov: 30, // 略微放大透视
    mouseIntensity: 0.4 // 增加一点随动的灵敏度
  },
  contact: {
    pos: new THREE.Vector3(0.25, -45, 30),
    rot: new THREE.Euler(1, 0, 0),
    fov: 40,
    mouseIntensity: 1
  }
}

export type SceneStateKey = keyof typeof SCENE_STATES

export const CAMERA_CONFIG = {
  transitionStep: 0.05
}

export const SHOW_DEBUG = false