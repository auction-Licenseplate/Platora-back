import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SendFailEmailDto } from 'src/dtos/send-fail-email.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { AlertResponseDto } from 'src/dtos/alert-res.dto';

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

    // 알림 전체 정보 전달
    @Get('/getAlert')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '알림 정보 전체 전달'})
    @ApiBearerAuth('accessToken')
    @ApiResponse({ status: 200, type: AlertResponseDto, isArray: true })
    async sendAlert(@Req() req){
        const userId = req.user.id;
        return this.notificationService.sendAlertData(userId);
    }

    // 읽음 처리 변경
    @Patch('/:id')
    @ApiOperation({ summary: '알림확인 처리 변경'})
    @ApiResponse({ status: 200, description: '알림 변경 완료' })
    async alertCheck(@Param('id') id: number, @Body('check') check: boolean){
        return this.notificationService.alertChkUpdate(id, check);
    }
}
