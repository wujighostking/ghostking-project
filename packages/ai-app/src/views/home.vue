<script setup lang="ts">
import axios from 'axios'
import { shallowRef, useTemplateRef } from 'vue'

const inputRef = useTemplateRef('input')
const messages = shallowRef<Record<string, string>[]>([])
async function handleClick() {
  const content = inputRef.value?.value
  if (!content || content?.length === 0) return

  messages.value.push({ role: 'user', content })

  const response = await axios.post('http://localhost:3000/ask', {
    messages: messages.value,
  })

  messages.value = [...messages.value, response.data]
}
</script>

<template>
  <div>
    <input type="text" ref="input" />
    <button @click="handleClick">Click me</button>

    <template v-for="message in messages" :key="message.content">
      <div :class="message.role === 'user' ? 'c-red' : 'c-green'">{{ message.content }}</div>
    </template>
  </div>
</template>

<style scoped></style>
