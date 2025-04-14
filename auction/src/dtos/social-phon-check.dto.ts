import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SocialPhoneCheckDto {
    @ApiProperty({ example: '01012345678', description: '전화번호' })
    @IsString()
    phone: string;
}
