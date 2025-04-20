import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
(global as any).crypto = require('crypto');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());
  app.use('/static', express.static(join(__dirname, '..', 'public')));
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:4000'], // 여러 도메인 허용
    credentials: true, // 쿠키 전송 허용
  });

  const options = new DocumentBuilder()
    .setTitle('Platora API 문서')
    .setDescription('Platora 프로젝트를 위한 NestJS 기반 API 문서입니다.')
    .setVersion('0.0.1')
    .addTag('Platora') // 태그명
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'accessToken', // 스키마 정의
    )
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document); // swagger 경로 지정

  // 포트 설정 (5000으로 수정)
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;

  await app.listen(port);
  console.log(`🚀 서버 실행중 http://localhost:${port}`);
  console.log(`📚 Swagger 문서: http://localhost:${port}/api`);
}
bootstrap();
