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
}
