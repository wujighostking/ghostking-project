import type { PerspectiveCamera, WebGLRenderer } from 'three'
import { OrbitControls } from 'three/addons'

export interface OrbitControlsOptions extends Partial<typeof OrbitControls.prototype> {
  camera: PerspectiveCamera
  renderer: WebGLRenderer
}

export function useOrbitControls(options: OrbitControlsOptions) {
  const { camera, renderer, ...rest } = options

  const control = new OrbitControls(camera, renderer.domElement)

  control.enableDamping = true

  if (rest) {
    Object.assign(control, rest)
  }

  return control
}
