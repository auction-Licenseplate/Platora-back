import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { PayService } from './pay.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RefundPointDto } from 'src/dtos/refund-point.dto';
import { TossPayDto } from 'src/dtos/toss-pay.dto';

@Controller('pay')
export class PayController {
    constructor(
        private readonly payService: PayService
    ) {}

    // 환불할 포인트
    @UseGuards(JwtAuthGuard)
    @Post('/refund-point')
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: '포인트 환불 요청' })
    @ApiResponse({ status: 200, 
        schema: {example: {
            message: '환불정보 저장 성공',
            refund: {
                account: '110-1234-5678',
                card_company: '신한카드',
                refund_amount: 5000,
                refund_status: 'success',
            },
            remainPoint: 2000,
        }}
    })
    async refundPoint(@Req() req, @Body() body: RefundPointDto){
        const userId = req.user.id; // jwt에서 유저id 가져옴
        const { account, cardCompany, refundPoint } = body;

        return await this.payService.getRefundInfo(userId, account, cardCompany, refundPoint);
    }
    
    // 환불 성공여부 전달
    @UseGuards(JwtAuthGuard)
    @Get('/refundData')
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: '환불 내역 조회' })
    @ApiResponse({ status: 200, schema: {example: {refund_amount: 5000, refund_status: 'success'}}})
    async refundCheck(@Req() req){
        const userId = req.user.id; // jwt에서 유저id 가져옴
        return await this.payService.refundState(userId);
    }

    // 토스 클라이언트 키 전달
    @Get('/toss-client-key')
    @ApiOperation({ summary: '토스 클라이언트 키 전달' })
    @ApiResponse({ status: 200, schema: {example: {tossClientKey: '토스 결제 API 클라이언트 키'}}})
    async tossClient(){
        return { tossClientKey : process.env.TOSS_CLIENT_KEY };
    }

    // 토스 결제 정보 저장
    @UseGuards(JwtAuthGuard)
    @Post('/save')
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: '토스 결제 정보 저장' })
    @ApiResponse({ status: 200, 
        schema: {example: {message: '결제정보 저장완료', payment: {amount: 10000, payment_method: '카드', status: 'paid'}}}
    })
    async tossSave(@Req() req, @Body() body: TossPayDto ){
        const userId = req.user.id;
        return await this.payService.tossSave(userId, body);
    }

    // 사용자 포인트 정보 전달
    @Get('/payInfo')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: '사용자 포인트 정보 조회' })
    @ApiResponse({ status: 200, schema: {
        example: {
            message: '포인트정보 전달 완료',
            payPoint: [
                {
                    amount: 10000,
                    refund_amount: 1100,
                    status: 'paid',
                    refund_status: 'waiting',
                    point_minus: 100,
                    create_at: '2025-04-14T00:00:00.000Z',
                }
            ],
            refundPoint: [
                {
                    bid_price: 5000,
                    refund_bid_price: null,
                    create_at: '2025-04-13T00:00:00.000Z',
                }
            ]
        }
    }})
    async userPoint(@Req() req){
        const userId = req.user.id;
        return await this.payService.pointData(userId);
    }

    // 포인트 차감
    @Post('/pointminus')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth('accessToken')
    @ApiOperation({ summary: '포인트 100 차감' })
    @ApiResponse({ status: 200, description: '포인트 차감 성공' })
    async userPointMins(@Req() req) {
        const userId = req.user.id;
        return await this.payService.pointDelete(userId);
    }
}


