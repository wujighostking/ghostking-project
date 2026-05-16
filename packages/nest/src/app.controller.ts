import { Body, Controller, Post, Res } from '@nestjs/common'
import type { Response } from 'express'

import { AppService, type StreamBody } from './app.service'

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/ask')
  async ask(@Body() body: any) {
    return await this.appService.ask(body)
  }

  @Post('/stream')
  async streamPost(@Body() body: StreamBody | undefined, @Res() response: Response) {
    await this.appService.writeResponseStreamWithoutRxjs(response, body?.messages ?? [])
  }
}
