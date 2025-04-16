import { ApiProperty } from '@nestjs/swagger';

export class RefundUserInfoDto {
    @ApiProperty({ example: 3, description: '유저 ID' })
    userId: number;
  
    @ApiProperty({ example: '홍길동', description: '이름' })
    name: string;
  
    @ApiProperty({ example: 'user@example.com', description: '이메일' })
    email: string;
  
    @ApiProperty({ example: '12345678901234', description: '계좌번호' })
    account: string;
  
    @ApiProperty({ example: '신한카드', description: '카드사 정보' })
    cardCompany: string;
  
    @ApiProperty({ example: 10000, description: '환불 금액' })
    amount: number;
}
  