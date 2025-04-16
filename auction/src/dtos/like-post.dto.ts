import { ApiProperty } from '@nestjs/swagger';

export class LikePostRequestDto {
    @ApiProperty({ example: 1, description: '경매 ID' })
    id: number;

    @ApiProperty({ example: '3', description: '사용자 ID' })
    userId: string;
}
