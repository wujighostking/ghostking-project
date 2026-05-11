import { WebGLRenderer, type WebGLRendererParameters } from 'three'

export interface WebGLRendererOptions extends Partial<WebGLRendererParameters> {
  size?: [number, number]
  container?: HTMLElement
}

export function useWebGLRenderer(options?: WebGLRendererOptions) {
  const {
    antialias = true,
    container = document.body,
    size = [
      container.clientWidth || window.innerWidth,
      container.clientHeight || window.innerHeight,
    ],
    ...rest
  } = options ?? {}

  const renderer = new WebGLRenderer({ antialias, ...rest })

  renderer.setSize(...size)

  if (!options?.canvas && container) {
    container.appendChild(renderer.domElement)
  }

  window.addEventListener('resize', () => {})

  return renderer
}
