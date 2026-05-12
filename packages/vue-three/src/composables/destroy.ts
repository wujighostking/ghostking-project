import { Object3D, type Scene } from 'three'

import { EMPTY_ARRAY } from '../constants'

type DisposableResource = {
  dispose?: () => void
  [key: string]: unknown
}

type MeshLike = {
  geometry?: { dispose?: () => void }
  material?: DisposableResource | DisposableResource[]
}

export function destroy(scene: Scene): void
export function destroy(scene: Scene, object3D: Object3D): void
export function destroy(scene: Scene, object3D: Object3D[]): void
/**
 * @description 销毁场景网格模型及释放 GPU 资源
 */
export function destroy(scene: Scene, object3D?: Object3D | Object3D[]) {
  if (arguments.length === 1) {
    destroyAll(scene)
  } else if (arguments.length === 2) {
    if (object3D && !Array.isArray(object3D)) {
      object3D = [object3D]
    }

    destroyObject3D(scene, object3D)
  }
}

export function destroyAll(scene: Scene) {
  disposeObjectResources(scene)
  scene.clear()
}

export function destroyObject3D(scene: Scene, object3D?: Object3D[]) {
  if (!object3D?.length) return

  object3D.forEach((target) => destroyOne(scene, target))
}

export function destroyOne(scene: Scene, object3D: Object3D) {
  disposeObjectResources(object3D)

  if (object3D.parent) {
    object3D.parent.remove(object3D)
  } else {
    scene.remove(object3D)
  }
}

function disposeObjectResources(target: Object3D) {
  target.traverse((obj) => {
    const mesh = obj as MeshLike
    mesh.geometry?.dispose?.()

    normalizeMaterials(mesh.material).forEach(disposeMaterialResources)
  })
}

function normalizeMaterials(material?: DisposableResource | DisposableResource[]) {
  if (!material) return EMPTY_ARRAY
  return Array.isArray(material) ? material : [material]
}

function disposeMaterialResources(material: DisposableResource) {
  Object.values(material).forEach((value) => {
    if (
      value &&
      typeof value === 'object' &&
      'dispose' in value &&
      typeof value.dispose === 'function'
    ) {
      value.dispose()
    }
  })

  material.dispose?.()
}
