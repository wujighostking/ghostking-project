import { usePerspectiveCamera } from './usePerspectiveCamera'
import { useRender } from './useRender'
import { useScene } from './useScene'
import { useWebGLRenderer } from './useWebGLRenderer'

export function useViewer(container: HTMLElement) {
  const scene = useScene()
  const camera = usePerspectiveCamera({
    fov: 75,
    aspect: window.innerWidth / window.innerHeight,
    near: 0.1,
    far: 1000,

    position: [0, 0, 50],
    lookAt: [0, 0, 0],
  })
  scene.add(camera)

  const renderer = useWebGLRenderer({ container, powerPreference: 'high-performance' })

  const cancelAnimation = useRender(scene, camera, renderer)

  return { scene, camera, renderer, ...cancelAnimation }
}
