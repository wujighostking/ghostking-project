import { PerspectiveCamera, Vector3 } from 'three'

export interface PerspectiveCameraOptions extends Partial<
  Omit<typeof PerspectiveCamera.prototype, 'position' | 'lookAt'>
> {
  fov?: number
  aspect?: number
  near?: number
  far?: number

  position?: [number, number, number] | Vector3
  lookAt?: [number, number, number] | Vector3
}

export function usePerspectiveCamera(options: PerspectiveCameraOptions) {
  const {
    fov = 75,
    aspect = window.innerWidth / window.innerHeight,
    near = 0.01,
    far = 100000,

    position,
    lookAt,

    ...rest
  } = options

  const camera = new PerspectiveCamera(fov, aspect, near, far)

  if (position instanceof Vector3) {
    camera.position.set(position.x, position.y, position.z)
  } else if (position instanceof Array) {
    camera.position.set(...position)
  }

  if (lookAt instanceof Vector3) {
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z)
  } else if (lookAt instanceof Array) {
    camera.lookAt(...lookAt)
  }

  if (rest) {
    Object.assign(camera, rest)
  }

  return camera
}
