import { ApiProperty } from '@nestjs/swagger';

export class AuctionItemInfoDto {
  @ApiProperty({ example: '12가3456', description: '차량 제목' })
  v_title: string;

  @ApiProperty({ example: 'bmw.jpg', description: '차량 이미지 파일명' })
  v_car_img: string;

  @ApiProperty({ example: '12가3456', description: '차량 번호판' })
  v_plate_num: string;

  @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
  u_email: string;

  @ApiProperty({ example: 5, description: '사용자 ID' })
  u_id: number;

  @ApiProperty({ example: '홍길동', description: '사용자 이름' })
  u_name: string;

  @ApiProperty({ example: 'approved', description: '글 등록 상태' })
  a_write_status: string;
}
