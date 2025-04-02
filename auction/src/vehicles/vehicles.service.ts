import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class VehiclesService {
  private readonly ZEMINAR_API_KEY: string;

  constructor(
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    private configService: ConfigService,
  ) {
    this.ZEMINAR_API_KEY =
      this.configService.get<string>('ZEMINAR_API_KEY') ?? '';
    console.log('ZEMINAR_API_KEY:', this.ZEMINAR_API_KEY); // 환경 변수 확인 로그
  }

  async getCarData(userId: number) {
    return this.vehicleRepository.find({
      where: { user: { id: userId } },
      select: ['plate_num', 'ownership_status'],
    });
  }

  async chatWithZeminar(userMessage: string) {
    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.ZEMINAR_API_KEY}`,
        {
          contents: [
            {
              role: 'user',
              parts: [{ text: userMessage }],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      const { candidates } = response.data;
      if (!candidates || candidates.length === 0) {
        throw new Error('재미나이 API에서 유효한 응답이 없음');
      }

      const text = candidates?.[0]?.content?.parts?.[0]?.text;
      console.log(text);
      return text;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(
          '재미나이 API 오류:',
          error.response?.status,
          error.response?.data,
        );
        throw new Error(`재미나이 API 오류: ${error.response?.status}`);
      } else {
        console.error('알 수 없는 오류:', error);
        throw new Error('알 수 없는 오류 발생');
      }
    }
  }

  // 작성글 저장
  async saveCarImg(userId: number, body: any, files: Express.Multer.File[]) {
    // 파일 이름으로 저장 (쉼표 구분)
    const filename = files.map((file) => file.filename).join(',');
    const vehicle = this.vehicleRepository.create({
      user: { id: userId },
      title: body.title,
      car_info: body.car_info,
      car_img: filename,
    });

    await this.vehicleRepository.save(vehicle);
    return { message: '작성글 저장완료', vehicle };
  }
}
