import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Matches } from 'class-validator';

export class SignUpDto {
    @ApiProperty({ example: 'test@example.com', description: '이메일 주소' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'strongPassword123!', description: '비밀번호 (유효성 검사 o)' })
    @IsString()
    password: string;

    @ApiProperty({ example: '홍길동', description: '사용자 이름' })
    @IsString()
    name: string;

    @ApiProperty({ example: '01012345678', description: '전화번호' })
    @IsString()
    phone: string;
}
