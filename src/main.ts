import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  if (!process.env.JWT_SECRET || !process.env.DATABASE_URL) {
    throw new Error('JWT_SECRET and DATABASE_URL must be set (see .env.example)');
  }
  const app = await NestFactory.create(AppModule);
  // Allowed browser origins come from CORS_ORIGINS (comma separated); none set = no browser access.
  const origins = (process.env.CORS_ORIGINS || '').split(',').map((o) => o.trim()).filter((o) => o.length > 0);
  app.enableCors({ origin: origins, allowedHeaders: ['Authorization', 'Content-Type'], methods: ['GET', 'POST', 'PATCH', 'DELETE'] });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  await app.listen(Number(process.env.PORT) || 3000);
}
bootstrap();
