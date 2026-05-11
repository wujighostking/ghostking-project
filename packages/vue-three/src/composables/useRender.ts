import { Camera, type Scene, type WebGLRenderer } from 'three'

export function useRender(
  scene: Scene,
  camera: Camera,
  renderer: WebGLRenderer,
  beforeRenderCallback?: (scene: Scene, camera: Camera, renderer: WebGLRenderer) => void,
  afterRenderCallback?: (scene: Scene, camera: Camera, renderer: WebGLRenderer) => void,
) {
  beforeRenderCallback?.(scene, camera, renderer)

  renderer.render(scene, camera)

  afterRenderCallback?.(scene, camera, renderer)

  const cancelAnimationId = requestAnimationFrame(() =>
    useRender(scene, camera, renderer, beforeRenderCallback, afterRenderCallback),
  )

  return {
    getCancelAnimationId: () => cancelAnimationId,
    cancel: (id?: number) => cancelAnimationFrame(id ?? cancelAnimationId),
  }
}
