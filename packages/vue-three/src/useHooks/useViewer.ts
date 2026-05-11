import { PerspectiveCamera, WebGLRenderer } from 'three'

import { useScene } from './useScene'

export function useViewer(container: HTMLElement) {
  const scene = useScene()
  const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

  camera.position.set(0, 0, 50)
  camera.lookAt(0, 0, 0)
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
