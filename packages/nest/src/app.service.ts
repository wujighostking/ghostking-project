import { Injectable } from '@nestjs/common'
import OpenAI from 'openai'

type MessageArray = Array<Record<string, string>>

@Injectable()
export class AppService {
  private messages: MessageArray = []
  private openai = new OpenAI({
    // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
    apiKey: 'sk-cecf74aa1dae4aa0be4c0a424f8d3259',
    baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  })

  async getHello() {
    // // 第 1 轮
    // this.messages.push({ role: 'user', content: '推荐一部关于太空探索的科幻电影。' })
    // console.log('第1轮')
    // console.log('用户：' + this.messages[0].content)
    //
    // let assistant_output = (await this.getResponse(this.messages))!
    // this.messages.push({ role: 'assistant', content: assistant_output })
    // console.log('模型：' + assistant_output + '\n')
    //
    // // 第 2 轮
    // this.messages.push({ role: 'user', content: '这部电影的导演是谁？' })
    // console.log('第2轮')
    // console.log('用户：' + this.messages[this.messages.length - 1].content)
    //
    // assistant_output = (await this.getResponse(this.messages))!
    // this.messages.push({ role: 'assistant', content: assistant_output })
    // console.log('模型：' + assistant_output + '\n')

    return this.messages
  }

  async ask(data: Record<string, string>) {
    const { messages } = data

    const response = await this.getResponse(messages)

    return response
  }

  private async getResponse(messages) {
    const completion = await this.openai.chat.completions.create({
      model: 'qwen-plus',
      messages: messages,
    })

    return completion.choices[0].message
  }
}
