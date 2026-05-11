import { Camera, type Scene, type WebGLRenderer } from 'three'

export type BeforeRenderCallback = (scene: Scene, camera: Camera, renderer: WebGLRenderer) => void
export type AfterRenderCallback = (scene: Scene, camera: Camera, renderer: WebGLRenderer) => void

export function useRender(
  scene: Scene,
  camera: Camera,
  renderer: WebGLRenderer,
  beforeRenderCallback?: BeforeRenderCallback,
  afterRenderCallback?: AfterRenderCallback,
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
