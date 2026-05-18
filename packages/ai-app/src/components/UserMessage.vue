<script setup lang="ts">
const props = defineProps({
  content: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="flex w-100% justify-end text-right">{{ props.content }}</div>
</template>

<style scoped></style>
