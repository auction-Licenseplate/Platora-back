import { ApiProperty } from '@nestjs/swagger';

export class SendFailEmailDto {
    @ApiProperty({
        description: '거절 사유 타입',
        example: '1',
    })
    type: string;

    @ApiProperty({
        description: '사용자 ID (PK)',
        example: 42,
    })
    userId: number;

    @ApiProperty({
        description: '거절 대상 종류 ("file" or "item")',
        example: 'file',
    })
    valuetype: string;

    @ApiProperty({
        description: '차량 번호판',
        example: '123가 1234',
    })
    plate: string;
}
