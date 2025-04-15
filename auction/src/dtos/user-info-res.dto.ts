import { ApiProperty } from '@nestjs/swagger';

export class UserInfoResponseDto {
    @ApiProperty({ example: '홍길동', description: '이름' })
    name: string;

    @ApiProperty({ example: '01012345678', description: '전화번호' })
    phone: string;

    @ApiProperty({ example: 'test@example.com', description: '이메일' })
    email: string;

    @ApiProperty({ example: 1000, description: '포인트' })
    point: number;

    @ApiProperty({ example: 'kakao', description: '회원가입 방식' })
    provider: string;
}
