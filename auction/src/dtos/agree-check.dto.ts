import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class AgreeCheckDto {
    @ApiProperty({ example: 'test@example.com', description: '유저 이메일' })
    @IsEmail()
    user_email: string;

    @ApiProperty({ example: '전체 동의', description: '동의한 약관 내용' })
    @IsString()
    term: string;
}
