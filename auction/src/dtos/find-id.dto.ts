import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindIdDto {
    @ApiProperty({ example: '홍길동', description: '사용자 이름' })
    @IsString()
    name: string;

    @ApiProperty({ example: '01012345678', description: '사용자 휴대폰 번호' })
    @IsString()
    phone: string;
}
