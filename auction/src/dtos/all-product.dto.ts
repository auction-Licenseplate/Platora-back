import { ApiProperty } from '@nestjs/swagger';

export class AllProductDto {
    @ApiProperty({ example: '홍길동', description: '사용자 이름' })
    userName: string;

    @ApiProperty({ example: '12가1234', description: '차량 제목' })
    vehicleTitle: string;

    @ApiProperty({ example: '1713173512345_img.png', description: '차량 이미지 파일명' })
    imageUrl: string;

    @ApiProperty({ example: '6', description: '등급명' })
    gradeName: string;

    @ApiProperty({ example: 300000, description: '최저 금액' })
    minPrice: number;

    @ApiProperty({ example: 1, description: '경매 ID (PK)' })
    auctionID: number;

    @ApiProperty({ example: 500000, description: '최종 가격' })
    finalPrice: number;

    @ApiProperty({ example: '2025-04-25T12:00:00.000Z', description: '경매 시작 시간' })
    startTime: Date;

    @ApiProperty({ example: '2025-04-30T12:00:00.000Z', description: '경매 종료 시간' })
    endTime: Date;

    @ApiProperty({ example: 'before', description: '경매 상태' })
    status: string;
}
