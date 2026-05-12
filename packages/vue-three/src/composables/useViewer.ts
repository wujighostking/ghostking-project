import type { Scene } from 'three'

import { destroy as _destroy } from './destroy'
import { type PerspectiveCameraOptions, usePerspectiveCamera } from './usePerspectiveCamera'
import { type AfterRenderCallback, type BeforeRenderCallback, useRender } from './useRender'
import { type SceneOptions, useScene } from './useScene'
import { useWebGLRenderer, type WebGLRendererOptions } from './useWebGLRenderer'

export interface ViewerOptions {
  container?: HTMLElement

  sceneOptions?: {
    options?: SceneOptions
    singleInstance?: boolean
  }
  perspectiveCameraOptions?: PerspectiveCameraOptions
  webGLRendererOptions?: WebGLRendererOptions
  renderOptions?: {
    beforeRenderCallback?: BeforeRenderCallback
    afterRenderCallback?: AfterRenderCallback
  }
}

export function useViewer(options: ViewerOptions) {
  const { container, sceneOptions, perspectiveCameraOptions, webGLRendererOptions, renderOptions } =
    options

  const scene = useScene(sceneOptions?.options, sceneOptions?.singleInstance)
  const camera = usePerspectiveCamera(perspectiveCameraOptions)
  scene.add(camera)

  const renderer = useWebGLRenderer(
    { container, ...webGLRendererOptions } /*{ container, powerPreference: 'high-performance' }*/,
  )

  const cancelAnimation = useRender(
    scene,
    camera,
    renderer,
    renderOptions?.beforeRenderCallback,
    renderOptions?.afterRenderCallback,
  )

  return {
    scene,
    camera,
    renderer,
    destroy: (s: Scene) => _destroy(s ?? scene),
    ...cancelAnimation,
  }
}
