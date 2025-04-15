import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendFailEmailDto } from 'src/dtos/send-fail-email.dto';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}
    // 공인인증서, 경매물품 거절 이메일
    @Post('/failvalue')
    @ApiOperation({ summary: '거절 이메일 전송'})
    @ApiResponse({ status: 200, description: '거절 메일 전송 완료' })
    async sendEmail(@Body() body: SendFailEmailDto){
        const {type, userId, valuetype, plate} = body;
        return this.notificationService.sendTypeEmail(type, userId, valuetype, plate);
    }
}
