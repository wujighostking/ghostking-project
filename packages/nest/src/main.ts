import { NestFactory } from '@nestjs/core'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { AppModule } from './app.module'

const envFilePath = join(__dirname, '..', '.env')

if (existsSync(envFilePath)) {
  process.loadEnvFile(envFilePath)
}

async function main() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  await app.listen(process.env.PORT ?? 3000)
}

main()
