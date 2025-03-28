import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // 프론트엔드 URL 허용
    credentials: true,
  });
  
  // 환경변수에서 포트 로드 (5000으로 수정)
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 5000;

  await app.listen(port);
  console.log(`🚀 서버 실행중 http://localhost:${port}`)
}
bootstrap();
