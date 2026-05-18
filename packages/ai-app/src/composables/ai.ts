import { fetchEventSource } from '@microsoft/fetch-event-source'
import { shallowRef } from 'vue'

type Message = { id: string; role: 'user' | 'assistant' | 'system'; content: string }
export const messages = shallowRef<Message[]>([
  // { id: '1', role: 'user', content: '推荐一部关于太空探索的科幻电影。' },
  // { id: '2', role: 'assistant', content: '我推荐《xxx》，这是一部经典的科幻作品。' },
  // { id: '3', role: 'user', content: '这部电影的导演是谁？' },
])

type ChatMessage = {
  role: 'system' | 'user' | 'assistant'
  content: string
}

const isStreaming = shallowRef(false)

export async function getStreamResponse(content: string) {
  let streamController: AbortController | undefined

  await handleStreamClick(content)

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

  async function handleStreamClick(content: string) {
    closeStream()

    messages.value = [...messages.value, { id: messages.value.length + '', role: 'user', content }]

    const controller = new AbortController()
    streamController = controller
    isStreaming.value = true

    let isStart = true
    try {
      let assistantMessages = ''
      await fetchEventSource('http://localhost:3000/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: messages.value,
        }),
        signal: controller.signal,
        openWhenHidden: true,
        onmessage(event) {
          if (event.event === 'done') {
            closeStream(controller)
            return
          }

          assistantMessages += event.data

          if (isStart) {
            isStart = false
            messages.value = [
              ...messages.value,
              { id: messages.value.length + '', role: 'assistant', content: assistantMessages },
            ]
          } else {
            const assistant: Message = messages.value[messages.value.length - 1] as Message
            messages.value = [
              ...messages.value.slice(0, -1),
              { ...assistant, content: assistantMessages },
            ]
          }
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
      isStart = false
      closeStream(controller)
    }
  }
}
