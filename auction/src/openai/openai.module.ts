import { Module } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { OpenaiController } from './openai.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicles])],
  providers: [OpenaiService],
  controllers: [OpenaiController]
})
export class OpenaiModule {}
