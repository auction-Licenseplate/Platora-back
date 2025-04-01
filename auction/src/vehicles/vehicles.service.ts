import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config'; // ConfigService 추가
import OpenAI from 'openai'; // OpenAI SDK 임포트

@Injectable()
export class VehiclesService {
  private readonly openai: OpenAI;

  constructor(
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    private configService: ConfigService, // ConfigService 주입
  ) {
    // OpenAI 인스턴스를 환경변수에서 API 키를 사용하여 초기화
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'), // OPENAI_API_KEY를 환경변수에서 가져옴
    });
  }

  // 차량 정보 제공
  async getCarData(userId: number) {
    const carData = await this.vehicleRepository.find({
      where: { user: { id: userId } },
      select: ['plate_num', 'ownership_status'],
    });

    return carData;
  }

  // OpenAI 챗 API 호출
  // async chat(message: any) {
  //   const chatCompletion = await this.openai.chat.completions.create({
  //     messages: message,
  //     // model: this.configService.get('OPENAI_API_MODEL'), // 모델 이름은 환경변수에서 가져올 수 있습니다.
  //   });
  //   return chatCompletion.choices[0].message.content;
  // }
}
