<script setup lang="ts">
import VueMarkdown from 'vue-markdown-render'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <VueMarkdown :source="props.content"></VueMarkdown>
</template>

<style scoped></style>
