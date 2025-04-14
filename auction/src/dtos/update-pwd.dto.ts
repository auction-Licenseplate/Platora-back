import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
    @ApiProperty({ example: 1, description: '사용자 ID (PK)' })
    @IsNumber()
    userID: number;

    @ApiProperty({ example: 'newStrongPassword123!', description: '새 비밀번호' })
    @IsString()
    @MinLength(10)
    password: string;
}
