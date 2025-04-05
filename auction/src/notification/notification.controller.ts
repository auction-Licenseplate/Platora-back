import { Body, Controller, Post } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    // 공인인증서 오류 이메일 전송
    @Post('/failvalue')
        async sendEmail(@Body() body: { email: string; type: string }){
        console.log('나타나라얍', body);
        const {email, type} = body;
    return this.notificationService.sendTypeEmail(email, type);
    }
}
