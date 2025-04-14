import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class PlusInfoDto {
    @ApiProperty({ example: 1, description: '사용자 ID (PK)' })
    @IsNumber()
    userID: number;

    @ApiProperty({ example: '홍길동', description: '사용자 이름' })
    @IsString()
    name: string;

    @ApiProperty({ example: '01012345678', description: '사용자 휴대폰 번호' })
    @IsString()
    phone: string;
}
