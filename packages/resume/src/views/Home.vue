<script setup lang="ts">
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { onMounted, useTemplateRef } from 'vue'
import { useViewer } from 'vue-three'

const containerRef = useTemplateRef('container')

onMounted(() => {
  const container = containerRef.value
  if (!container) return

  const { scene } = useViewer({
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
  const mesh = new Mesh(new BoxGeometry(10, 10, 10), new MeshBasicMaterial({ color: '#fff' }))
  mesh.position.set(0, 0, 0)
  scene.add(mesh)
})
</script>

<template>
  <div ref="container" class="w-[100vw] h-[100vh]"></div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
