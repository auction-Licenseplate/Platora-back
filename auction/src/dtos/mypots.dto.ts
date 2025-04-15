import { ApiProperty } from '@nestjs/swagger';

export class MyPostResponseDto {
    @ApiProperty({ example: '홍길동', description: '사용자 이름' })
    userName: string;

    @ApiProperty({ example: '12가3456', description: '게시글 제목' })
    vehicleTitle: string;

    @ApiProperty({ example: '6', description: '등급명' })
    gradeName: string;

    @ApiProperty({ example: 300000, description: '최저 금액' })
    minPrice: number;

    @ApiProperty({ example: 500000, description: '최종 가격' })
    finalPrice: number;

    @ApiProperty({ example: 'car1.jpg', description: '차량 이미지 파일명' })
    carImage: string;

    @ApiProperty({ example: '차량연도~', description: '차량 상세 정보' })
    carInfo: string;
}
