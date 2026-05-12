<script setup lang="ts">
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  type PerspectiveCamera,
  type Scene,
  type WebGLRenderer,
} from 'three'
import type { OrbitControls } from 'three/addons'
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { useViewer, useOrbitControls, type destroy } from 'vue-three'

const containerRef = useTemplateRef('container')

let _destroy: typeof destroy
let _removeResize: () => void
let _scene: Scene
let _camera: PerspectiveCamera
let _renderer: WebGLRenderer
let controls: OrbitControls
onMounted(() => {
  const container = containerRef.value
  if (!container) return

  const { scene, camera, renderer, destroy, removeResize } = useViewer({
    container,

    perspectiveCameraOptions: {
      fov: 75,
      aspect: container.clientWidth / container.clientHeight,
      near: 0.1,
      far: 1000,

      position: [0, 0, 50],
      lookAt: [0, 0, 0],
    },
    renderOptions: {
      afterRenderCallback: () => {
        controls?.update?.()
      },
    },
  })
  _destroy = destroy
  _scene = scene
  _camera = camera
  _renderer = renderer
  _removeResize = removeResize

  const mesh = new Mesh(new BoxGeometry(10, 10, 10), new MeshBasicMaterial({ color: '#fff' }))
  mesh.position.set(0, 0, 0)
  scene.add(mesh)

  controls = useOrbitControls({
    camera,
    renderer,

    enableDamping: true,
    dampingFactor: 0.01,
  })
})

onBeforeUnmount(() => {
  _destroy?.(_scene)
  _removeResize?.()
  controls?.dispose()
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
