import { ApiProperty } from '@nestjs/swagger';

export class BannerDto {
    @ApiProperty({ example: '배너 제목', description: '배너 제목' })
    banner_title: string;
  
    @ApiProperty({ example: '1713172981234_event.jpg', description: '배너 이미지 파일명' })
    banner_img: string;
}
  