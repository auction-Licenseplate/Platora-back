import { ApiProperty } from '@nestjs/swagger';

export class ApprovedPostDto {
  @ApiProperty({ example: 1, description: '경매 Id (PK)'})
  auctionId: number;

  @ApiProperty({ example: 'AUC-2024-001', description: '경매 번호' })
  auctionNum: string;

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

  @ApiProperty({ example: '2025-04-30T12:00:00Z', description: '종료 시간' })
  endTime: string;

  @ApiProperty({ example: 'before', description: '경매 상태' })
  status: string;

  @ApiProperty({ example: 'car1.jpg', description: '차량 이미지 파일명' })
  carImage: string;

  @ApiProperty({ example: '차량연도~', description: '차량 상세 정보' })
  carInfo: string;
}
