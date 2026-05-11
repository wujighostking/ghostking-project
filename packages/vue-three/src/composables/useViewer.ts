import { WebGLRenderer } from 'three'

import { usePerspectiveCamera } from './usePerspectiveCamera'
import { useScene } from './useScene'

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

  const renderer = new WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  container.appendChild(renderer.domElement)

  function render() {
    renderer.render(scene, camera)

    requestAnimationFrame(render)
  }

  render()

  return { scene, camera, renderer }
}
