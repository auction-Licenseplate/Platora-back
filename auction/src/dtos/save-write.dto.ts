import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SaveWriteDto {
  @ApiProperty({ example: '12가3456', description: '차량 번호 (title로 사용됨)' })
  @IsString()
  title: string;

  @ApiProperty({ example: '차량연도~', description: '차량 상세 정보' })
  @IsString()
  car_info: string;
}
