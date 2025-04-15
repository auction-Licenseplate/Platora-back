import { ApiProperty } from '@nestjs/swagger';

export class UpdatePriceDto {
    @ApiProperty({ example: 1, description: '경매 ID' })
    id: number;

    @ApiProperty({ example: 10000, description: '입찰가' })
    price: number;

    @ApiProperty({ example: '3', description: '현재 입찰자 ID' })
    userId: string;

    @ApiProperty({ example: 9000, description: '이전 입찰가' })
    prePrice?: number;

    @ApiProperty({ example: '2', description: '이전 입찰자 ID' })
    preUserId?: string;
}
