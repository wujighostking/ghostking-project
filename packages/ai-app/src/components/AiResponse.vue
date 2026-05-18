<script setup lang="ts">
import { Markdown } from 'vue-stream-markdown'

import 'vue-stream-markdown/index.css'
import 'vue-stream-markdown/theme.css'

const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <Markdown :content="props.content"></Markdown>
</template>

<style scoped></style>
