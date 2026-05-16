import { Injectable } from '@nestjs/common'
import type { Response } from 'express'
import OpenAI from 'openai'
import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions'

export type MessageArray = ChatCompletionMessageParam[]
export type StreamBody = {
  messages?: MessageArray
}

@Injectable()
export class AppService {
  private openai = new OpenAI({
    // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
    apiKey: 'sk-cecf74aa1dae4aa0be4c0a424f8d3259',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  })

  async ask(data: { messages: MessageArray }) {
    const { messages } = data

    const response = await this.getResponse(messages)

    return response
  }

  private async getResponse(messages: MessageArray) {
    const completion = await this.openai.chat.completions.create({
      model: 'qwen-plus',
      messages: messages,
    })

    return completion.choices[0].message
  }

  async writeResponseStreamWithoutRxjs(response: Response, messages: MessageArray = []) {
    response.setHeader('Content-Type', 'text/event-stream')
    response.setHeader('Cache-Control', 'no-cache, no-transform')
    response.setHeader('Connection', 'keep-alive')
    response.flushHeaders()

    const controller = new AbortController()

    response.on('close', () => {
      controller.abort()
    })

    try {
      const stream = await this.openai.chat.completions.create(
        {
          model: 'qwen-plus',
          messages,
          stream: true,
        },
        { signal: controller.signal },
      )

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content

        if (content) {
          response.write(`data: ${JSON.stringify(content)}\n\n`)
        }
      }

      response.write(`event: done\ndata: "[DONE]"\n\n`)
      response.end()
    } catch (error) {
      if (!controller.signal.aborted) {
        response.write(`event: error\ndata: ${JSON.stringify('Stream error')}\n\n`)
        response.end()
      }
    }
  }
}
