import { Scene } from 'three'

export type SceneOptions = Partial<typeof Scene.prototype>

export interface UseScene {
  (options?: SceneOptions, singleInstance?: boolean): Scene
  sceneInstance?: Scene
}

export const useScene: UseScene = (options?: SceneOptions, singleInstance: boolean = false) => {
  if (singleInstance && useScene.sceneInstance) return useScene.sceneInstance

  const scene = new Scene()
  if (options) {
    Object.assign(scene, options)
  }

  if (singleInstance) {
    useScene.sceneInstance = scene
  }

  return scene

  /**
   * @description 销毁场景网格模型及释放 GPU 资源
   */
  function destory() {
    scene.traverse((obj) => {
      const mesh = obj as typeof obj & {
        geometry?: { dispose?: () => void }
        material?:
          | { dispose?: () => void; [key: string]: unknown }
          | Array<{ dispose?: () => void; [key: string]: unknown }>
      }

      mesh.geometry?.dispose?.()

      const materials = Array.isArray(mesh.material)
        ? mesh.material
        : mesh.material
          ? [mesh.material]
          : []

      materials.forEach((material) => {
        Object.values(material).forEach((value) => {
          if (value && typeof value === 'object' && 'dispose' in value && typeof value.dispose === 'function') {
            value.dispose()
          }
        })
        material.dispose?.()
      })
    })

    scene.clear()
  }
}
