import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class OpenaiService {
    private readonly ZEMINAR_API_KEY: string;
    constructor(
        @InjectRepository(Vehicles)
        private vehicleRepository: Repository<Vehicles>,
        private configService: ConfigService,
      ) {
        this.ZEMINAR_API_KEY =
          this.configService.get<string>('ZEMINAR_API_KEY') ?? '';
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
}
