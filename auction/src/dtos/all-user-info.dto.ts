import { ApiProperty } from '@nestjs/swagger';

export class UserInfoDto {
    @ApiProperty({ example: 'user@example.com', description: '이메일' })
    email: string;
  
    @ApiProperty({ example: '홍길동', description: '이름' })
    name: string;
  
    @ApiProperty({ example: '01012345678', description: '전화번호' })
    phone: string;
}

export class UserInfoListDto {
    @ApiProperty({ type: [UserInfoDto], description: '유저 정보 리스트' })
    userInfo: UserInfoDto[];
}
  