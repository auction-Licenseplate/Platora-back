import { ApiProperty } from '@nestjs/swagger';

    export class RefundPointDto {
    @ApiProperty({
        description: '환불받을 계좌번호',
        example: '110-1234-5678',
    })
    account: string;

    @ApiProperty({
        description: '카드사 이름',
        example: '신한카드',
    })
    cardCompany: string;

    @ApiProperty({
        description: '환불 요청 포인트',
        example: 5000,
    })
    refundPoint: number;
}
