<script setup lang="ts">
import { nextTick, onMounted, ref, useTemplateRef } from 'vue'

import { getStreamResponse } from '@/composables/ai.ts'

const inputFieldContainer = useTemplateRef<HTMLDivElement>('inputFieldContainer')
const inputField = useTemplateRef<HTMLTextAreaElement>('inputField')

const isResponsing = ref(false)

function syncInputHeight() {
  const field = inputField.value
  const container = inputFieldContainer.value

  if (!field || !container) return

  container.style.height = 'auto'
  container.style.height = `${field.scrollHeight}px`
}

function sendMessages() {
  const content = inputField.value?.value.trim()
  if (!content) return

  isResponsing.value = true
  getStreamResponse(content).finally(() => {
    isResponsing.value = false
  })

  if (inputField.value?.value) inputField.value.value = ''
  void nextTick(syncInputHeight)
}

function handleEnter(event: KeyboardEvent) {
  if (event.isComposing) return

  event.preventDefault()
  sendMessages()
}

onMounted(() => {
  nextTick(syncInputHeight)
})
</script>

<template>
  <div class="chat-input" ref="inputFieldContainer">
    <textarea
      ref="inputField"
      class="chat-input__field"
      placeholder="发送消息..."
      @input="syncInputHeight"
      @keydown.enter="handleEnter"
      :disabled="isResponsing"
    />
  </div>
</template>

<style scoped>
.chat-input {
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
  width: 100%;
  min-height: 110px;
  height: auto;
  margin: 14px auto 0;
  padding: 14px 18px 12px;
  background: #fff;
  border: 1px solid #9ec4ff;
  border-radius: 24px;
  box-shadow: 0 12px 28px rgb(71 128 213 / 16%);
}

.chat-input__field {
  flex: 1;
  width: 100%;
  min-height: 82px;
  color: #111827;
  line-height: 1.5;
  background: transparent;
  border: 0;
  outline: 0;
  overflow: hidden;
  resize: none;
}
</style>
