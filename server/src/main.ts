import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as express from 'express'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/web', express.static('/home/pc/Project/phonebook/server/files/avatar'))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  app.enableCors();
  await app.listen(3001,'0.0.0.0');
}
bootstrap();
