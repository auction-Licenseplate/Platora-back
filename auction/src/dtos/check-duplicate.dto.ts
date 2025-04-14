import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CheckDuplicateDto {
    @ApiPropertyOptional({ example: 'test@example.com', description: '이메일 (type이 email일 경우 필수)' })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({ example: '01012345678', description: '전화번호 (type이 phone일 경우 필수)' })
    @IsString()
    @IsOptional()
    phone?: string;
}
