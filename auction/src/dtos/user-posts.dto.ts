// dto/user-posts-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UserPostResponseDto {
    @ApiProperty({ example: 5000000, description: '최종 가격' })
    au_final_price: number;

    @ApiProperty({ example: 'AUC-2024-001', description: '경매 번호' })
    au_auction_num: string;

    @ApiProperty({ example: 12, description: '경매 ID (PK)' })
    au_id: number;

    @ApiProperty({ example: '2025-05-01T12:00:00.000Z', description: '종료 시간' })
    au_end_time: string;

    @ApiProperty({ example: 'car1.jpg', description: '차량 이미지 파일명' })
    vehicle_car_img: string;

    @ApiProperty({ example: '12가3456', description: '차량 번호판' })
    vehicle_plate_num: string;

    @ApiProperty({ example: '6', description: '등급명' })
    grade_grade_name: string;

    @ApiProperty({ example: 3000000, description: '최저 금액' })
    grade_min_price: number;
}
