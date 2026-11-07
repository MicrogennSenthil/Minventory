import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
    throw new Error('JWT_SECRET and DATABASE_URL must be set (see .env.example)');
  }
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
