import * as THREE from 'three'

// 3D 场景业务逻辑配置
export const GRID_CONFIG = {
  size: 4.98,
  step: 5,
  zoomReference: 30,
  excluded: (x: number, y: number, cols: number, rows: number) => {
    const corners = [[0, rows - 1], [1, rows - 1], [cols - 1, 0], [cols - 2, 0]]
    return corners.some(([ex, ey]) => x === ex && y === ey)
  }
}

export const SCENE_STATES = [
  { 
    // 0: About - 经典的平面正交感
    pos: new THREE.Vector3(0, 0, 70),
    rot: new THREE.Euler(0, 0, 0),
    fov: 25,
    mouseIntensity: 0
  },
  { 
    // 1: Work - 稍微带一点倾角，体现空间感
    pos: new THREE.Vector3(10, 5, 65),
    rot: new THREE.Euler(-0.1, 0.2, 0.05),
    fov: 28,
    mouseIntensity: 0.3
  },
  { 
    // 2: Contact - 俯视透视，强烈的 3D 冲击力
    pos: new THREE.Vector3(0.25, -45, 30),
    rot: new THREE.Euler(1, 0, 0),
    fov: 40,
    mouseIntensity: 1
  }
]

export const CAMERA_CONFIG = {
  transitionStep: 0.05
}

export const SHOW_DEBUG = false
