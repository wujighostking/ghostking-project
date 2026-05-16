<script setup lang="ts">
import { fetchEventSource } from '@microsoft/fetch-event-source'
import axios from 'axios'
import { onUnmounted, shallowRef, useTemplateRef } from 'vue'

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const inputRef = useTemplateRef<HTMLInputElement>('input')
const messages = shallowRef<ChatMessage[]>([])
async function handleClick() {
  const content = inputRef.value?.value
  if (!content || content?.length === 0) return

  messages.value = [...messages.value, { role: 'user', content }]

  const response = await axios.post('http://localhost:3000/ask', {
    messages: messages.value,
  })

  messages.value = [...messages.value, response.data]
}

const inputStreamRef = useTemplateRef<HTMLInputElement>('inputStream')
const streamMessages = shallowRef<ChatMessage[]>([])
const isStreaming = shallowRef(false)
let streamController: AbortController | undefined

function closeStream(controller = streamController) {
  if (!controller) {
    isStreaming.value = false
    return
  }

  controller.abort()

  if (streamController === controller) {
    streamController = undefined
    isStreaming.value = false
  }
}

async function handleStreamClick() {
  const content = inputStreamRef.value?.value.trim()
  if (!content || content?.length === 0) return

  closeStream()

  const requestMessages = [...streamMessages.value, { role: 'user', content } satisfies ChatMessage]
  streamMessages.value = [...requestMessages, { role: 'assistant', content: '' }]

  const controller = new AbortController()
  streamController = controller
  isStreaming.value = true

  try {
    await fetchEventSource('http://localhost:3000/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: requestMessages,
      }),
      signal: controller.signal,
      openWhenHidden: true,
      onmessage(event) {
        if (event.event === 'done') {
          closeStream(controller)
          return
        }

        const assistantMessage = streamMessages.value.at(-1)

        if (!assistantMessage || assistantMessage.role !== 'assistant') return

        streamMessages.value = [
          ...streamMessages.value.slice(0, -1),
          { ...assistantMessage, content: `${assistantMessage.content}${event.data}` },
        ]
      },
      onclose() {
        closeStream(controller)
      },
      onerror(error) {
        throw error
      },
    })
  } catch {
    // fetchEventSource rejects when onerror stops retrying; state is reset below.
  } finally {
    closeStream(controller)
  }
}

onUnmounted(closeStream)
</script>

<template>
  <div>
    <input type="text" ref="input" />
    <button @click="handleClick">Click me</button>

    <template v-for="message in messages" :key="message.content">
      <div :class="message.role === 'user' ? 'c-red' : 'c-green'">{{ message.content }}</div>
    </template>
  </div>

  <hr />

  <div>
    <input type="text" ref="inputStream" />
    <button :disabled="isStreaming" @click="handleStreamClick">流式传输</button>

    <template v-for="(message, index) in streamMessages" :key="`${message.role}-${index}`">
      <div :class="message.role === 'user' ? 'c-red' : 'c-green'">{{ message.content }}</div>
    </template>
  </div>
</template>

<style scoped></style>
