import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PayService } from './pay.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('pay')
export class PayController {
    constructor(
        private readonly payService: PayService
    ) {}

    @UseGuards(JwtAuthGuard) // jwt 인증함
    @Post('/refund-point')
    async refundPoint(@Req() req, @Body() body){
        const userId = req.user.id; // jwt에서 유저id 가져옴
        const { account, cardCompany, refundPoint } = body;

        return await this.payService.getRefundInfo(userId, account, cardCompany, refundPoint);
    }

    @UseGuards(JwtAuthGuard) // jwt 인증함
    @Get('/refundData')
    async refundCheck(@Req() req){
        const userId = req.user.id; // jwt에서 유저id 가져옴
        return this.payService.refundState(userId);
    }
}


