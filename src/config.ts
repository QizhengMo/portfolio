import * as THREE from 'three'

// 3D 场景业务逻辑配置
export const GRID_CONFIG = {
  size: 4.98, // 稍微缩小一点，防止边缘重叠导致抖动
  step: 5,
  zoomReference: 30,
  excluded: (x: number, y: number, cols: number, rows: number) => {
    // 定义排除格子的坐标逻辑
    const corners = [[0, rows - 1], [1, rows - 1], [cols - 1, 0], [cols - 2, 0]]
    return corners.some(([ex, ey]) => x === ex && y === ey)
  }
}

export const CAMERA_CONFIG = {
  // 模拟正交模式的目标 (增加距离以覆盖全景)
  ortho: {
    pos: new THREE.Vector3(0, 0, 70),
    rot: new THREE.Euler(0, 0, 0),
    fov: 25
  },
  // 透视模式的目标
  persp: {
    target: {
      pos: new THREE.Vector3(0.25, -45, 30),
      rot: new THREE.Euler(1, 0, 0),
      fov: 40
    }
  },
  transitionStep: 0.05
}

export const SHOW_DEBUG = false
