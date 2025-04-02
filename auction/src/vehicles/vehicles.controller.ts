import { Controller, Get, Req, UseGuards, Post, Body } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehicleService: VehiclesService) {}

  // 차량 정보 가져오기
  @UseGuards(JwtAuthGuard)
  @Get('/vehicleData')
  async carOwnership(@Req() req) {
    const userId = req.user.id;
    return this.vehicleService.getCarData(userId);
  }

  // 재미나이 AI 채팅 API 호출
  @Post('/aichat')
  async createMessage(@Body() content: { message: string }) {
    if (!content.message) {
      return { error: '메시지를 입력해야 합니다.' };
    }

    try {
      const response = await this.vehicleService.chatWithZeminar(
        content.message,
      );
      return response;
    } catch (error) {
      return { error: 'AI 응답을 가져오는 데 실패했습니다.' };
    }
  }
}
