import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}
    // 공인인증서, 경매물품 거절 이메일
    @Post('/failvalue')
        async sendEmail(@Body() body: { type: string, userId: number, valuetype: string, plate: string}){
        const {type, userId, valuetype, plate} = body;
        return this.notificationService.sendTypeEmail(type, userId, valuetype, plate);
    }
}
