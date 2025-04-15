import { ApiProperty } from '@nestjs/swagger';

export class NewBidDto {
    @ApiProperty({ example: 10000, description: '입찰가' })
    bid_price: number;

    @ApiProperty({ example: 1, description: '경매 ID' })
    auction: number;

    @ApiProperty({ example: '3', description: '입찰자 ID' })
    user: string;

    @ApiProperty({ example: 'bid', description: '유형 (입찰/환불)' })
    type: string;
}

export class RefundBidDto {
    @ApiProperty({ example: 9000, description: '환불 입찰가' })
    refund_bid_price: number;

    @ApiProperty({ example: 1, description: '경매 ID' })
    auction: number;

    @ApiProperty({ example: '2', description: '환불 대상자 ID' })
    user: string;

    @ApiProperty({ example: 'refund', description: '유형 (입찰/환불)' })
    type: string;
}

export class UpdatePriceResponseDto {
    @ApiProperty({ example: '최종입찰가 갱신/입찰기록 저장/포인트처리 완료', description: '처리 메시지' })
    message: string;

    @ApiProperty({ type: NewBidDto, description: '새로운 입찰 정보' })
    newBid: NewBidDto;

    @ApiProperty({ type: RefundBidDto, description: '환불 입찰 정보' })
    refundBid?: RefundBidDto;
}
