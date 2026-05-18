import { shallowRef } from 'vue'

type Message = { id: string; role: 'user' | 'assistant' | 'system'; content: string }
export const messages = shallowRef<Message[]>([
  // { id: '1', role: 'user', content: '推荐一部关于太空探索的科幻电影。' },
  // { id: '2', role: 'assistant', content: '我推荐《xxx》，这是一部经典的科幻作品。' },
  // { id: '3', role: 'user', content: '这部电影的导演是谁？' },
])
