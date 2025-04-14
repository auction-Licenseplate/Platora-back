import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class FindPasswordDto {
    @ApiProperty({ example: 'user@example.com', description: '사용자 이메일' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '01012345678', description: '사용자 휴대폰 번호' })
    @IsString()
    phone: string;
}
