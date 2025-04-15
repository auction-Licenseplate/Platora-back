import { ApiProperty } from '@nestjs/swagger';

export class FavoriteDto {
    @ApiProperty({ example: '홍길동', description: '사용자 이름' })
    userName: string;

    @ApiProperty({ example: '1', description: '사용자 ID (PK)' })
    userId: string;

    @ApiProperty({ example: '12가3456', description: '게시글 제목' })
    vehicleTitle: string;

    @ApiProperty({ example: '6', description: '등급명' })
    gradeName: string;

    @ApiProperty({ example: 3000000, description: '최저 금액' })
    minPrice: number;

    @ApiProperty({ example: 5000000, description: '최종 가격' })
    finalPrice: number;

    @ApiProperty({ example: '2025-05-01T12:00:00.000Z', description: '종료 시간' })
    endTime: string;

    @ApiProperty({ example: 'before', description: '경매 상태' })
    status: string;

    @ApiProperty({ example: 42, description: '경매 ID (PK)' })
    auctionID: number;

    @ApiProperty({ example: 'car1.jpg', description: '차량 이미지 파일명' })
    carImage: string;
}
