import { ApiProperty } from '@nestjs/swagger';

export class FileInfoDto {
    @ApiProperty({ example: '홍길동', description: '차량 소유자 이름' })
    u_name: string;
  
    @ApiProperty({ example: 'cert.pfx', description: '공인인증서 파일명' })
    u_certification: string;
  
    @ApiProperty({ example: '12가3456', description: '차량 번호판' })
    v_plate_num: string;
  
    @ApiProperty({ example: 'user@example.com', description: '이메일' })
    u_email: string;
  
    @ApiProperty({ example: 5, description: '사용자 ID' })
    u_id: number;
}
  