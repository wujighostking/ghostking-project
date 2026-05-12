import type { Scene } from 'three'

/**
 * @description 销毁场景网格模型及释放 GPU 资源
 */
export function destroy(scene: Scene) {
  scene.traverse((obj) => {
    const mesh = obj as {
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
      Object.values(material).forEach((value: any) => {
        if (value && typeof value === 'object' && 'dispose' in value) {
          value.dispose?.()
        }
      })

      material.dispose?.()
    })
  })

  scene.clear()
}
