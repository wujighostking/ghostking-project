<script setup lang="ts">
import { BoxGeometry, Mesh, MeshBasicMaterial, Scene } from 'three'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { useViewer } from 'vue-three'

const containerRef = useTemplateRef('container')

let _destroy: (scene: Scene) => void
let _scene: Scene
let _removeResize: () => void
onMounted(() => {
  const container = containerRef.value
  if (!container) return

  const { scene, destroy, removeResize } = useViewer({
    container,

    perspectiveCameraOptions: {
      fov: 75,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.1,
      far: 1000,

      position: [0, 0, 50],
      lookAt: [0, 0, 0],
    },
  })
  _destroy = destroy
  _scene = scene
  _removeResize = removeResize

  const mesh = new Mesh(new BoxGeometry(10, 10, 10), new MeshBasicMaterial({ color: '#fff' }))
  mesh.position.set(0, 0, 0)
  scene.add(mesh)
})

onBeforeUnmount(() => {
  _destroy?.(_scene)
  _removeResize?.()
})
</script>

<template>
  <button @click="() => _destroy?.(_scene)">destroy</button>
  <div ref="container" class="w-[100vw] h-[100vh]"></div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
