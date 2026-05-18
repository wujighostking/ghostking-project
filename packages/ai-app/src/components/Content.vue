<script setup lang="ts">
import Context from '@/components/Context.vue'
import Input from '@/components/Input.vue'
</script>

<template>
  <div class="chat-content w-50% mx-auto">
    <Context></Context>
    <Input />
  </div>
</template>

<style scoped>
.chat-content {
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
