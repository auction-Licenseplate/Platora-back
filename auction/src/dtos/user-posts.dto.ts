// dto/user-posts-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserPostResponseDto {
    @ApiProperty({ example: 5000000, description: '최종 가격' })
    final_price: number;

    @ApiProperty({ example: 'AUC-2024-001', description: '경매 번호' })
    auction_num: string;

    @ApiProperty({ example: 12, description: '경매 ID (PK)' })
    id: number;

    @ApiProperty({ example: '2025-05-01T12:00:00.000Z', description: '종료 시간' })
    end_time: string;

    @ApiProperty({ example: 'car1.jpg', description: '차량 이미지 파일명' })
    car_img: string;

    @ApiProperty({ example: '12가3456', description: '차량 번호판' })
    plate_num: string;

    @ApiProperty({ example: '6', description: '등급명' })
    grade_name: string;

    @ApiProperty({ example: 3000000, description: '최저 금액' })
    min_price: number;
}
