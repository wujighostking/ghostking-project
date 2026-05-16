import { Body, Controller, Get, Post, Query, Sse } from '@nestjs/common'

import { AppService } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return await this.appService.getHello()
  }

  @Post('/ask')
  async ask(@Body() body: any) {
    return await this.appService.ask(body)
  }

  @Sse('/stream')
  stream(@Query('messages') messages = '[]') {
    return this.appService.getResponseStream(JSON.parse(messages))
  }
}
