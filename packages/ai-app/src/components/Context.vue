<script setup lang="ts">
import AiResponse from '@/components/AiResponse.vue'
import UserMessage from '@/components/UserMessage.vue'
import { messages } from '@/composables/ai.ts'
</script>

<template>
  <div class="chat-context w-100%">
    <template v-for="message in messages" :key="message.id">
      <user-message v-if="message.role === 'user'" :content="message.content"></user-message>
      <ai-response
        v-else-if="message.role === 'assistant'"
        :content="message.content"
      ></ai-response>
    </template>
  </div>
</template>

<style scoped>
.chat-context {
  flex: 1;
  min-height: 0;
}
</style>
