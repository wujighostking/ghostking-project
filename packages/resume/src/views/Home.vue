<script setup lang="ts">
import { BoxGeometry, Mesh, MeshBasicMaterial } from 'three'
import { onMounted, useTemplateRef } from 'vue'

import { useViewer } from '@/hooks/useViewer'

const containerRef = useTemplateRef('container')

onMounted(() => {
  const { scene } = useViewer(containerRef.value!)
  const mesh = new Mesh(new BoxGeometry(10, 10, 10), new MeshBasicMaterial({ color: '#fff' }))
  mesh.position.set(0, 0, 0)
  scene.add(mesh)
})
</script>

<template>
  <div ref="container"></div>
</template>

<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
