<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="">{{ props.content }}</div>
</template>

<style scoped></style>
