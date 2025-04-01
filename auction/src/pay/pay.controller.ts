import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PayService } from './pay.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('pay')
export class PayController {
    constructor(
        private readonly payService: PayService
    ) {}

    // 환불 정보 저장
    @UseGuards(JwtAuthGuard)
    @Post('/refund-point')
    async refundPoint(@Req() req, @Body() body){
        const userId = req.user.id; // jwt에서 유저id 가져옴
        const { account, cardCompany, refundPoint } = body;

        return await this.payService.getRefundInfo(userId, account, cardCompany, refundPoint);
    }
    
    // 환불 성공여부 전달
    @UseGuards(JwtAuthGuard)
    @Get('/refundData')
    async refundCheck(@Req() req){
        const userId = req.user.id; // jwt에서 유저id 가져옴
        return await this.payService.refundState(userId);
    }

    // 토스 클라이언트 키 전달
    @Get('/toss-client-key')
    async tossClient(){
        return { tossClientKey : process.env.TOSS_CLIENT_KEY };
    }

    // 토스 결제 정보 저장
    @UseGuards(JwtAuthGuard)
    @Post('/save')
    async tossSave(@Req() req, @Body() body: any ){
        console.log('넌어떻게나타나니',body)
        // { payment_method: '카드', amount: 342, status: 'success' } 이렇게 나타남
        const userId = req.user.id;
        return await this.payService.tossSave(userId, body);
    }
}


