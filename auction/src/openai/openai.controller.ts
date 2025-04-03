import { Body, Controller, Post } from '@nestjs/common';
import { VehiclesService } from 'src/vehicles/vehicles.service';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) {}

    // 재미나이 AI 채팅 API 호출
    @Post('/aichat')
    async createMessage(@Body() content: { message: string }) {
        if (!content.message) {
            return { error: '메시지를 입력해야 합니다.' };
        }

        try {
            const response = await this.openaiService.chatWithZeminar(
            content.message,
        );
            return response;
        } catch (error) {
            return { error: 'AI 응답을 가져오는 데 실패했습니다.' };
        }
    }
}
