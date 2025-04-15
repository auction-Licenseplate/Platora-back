import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TossPayDto {
    @ApiProperty({ example: 10000, description: '결제 금액' })
    @IsNumber()
    amount: number;

    @ApiProperty({ example: '카드', description: '결제 수단' })
    @IsString()
    payment_method: string;

    @ApiProperty({ example: 'paid', description: '결제 상태' })
    @IsString()
    status: string;
}
