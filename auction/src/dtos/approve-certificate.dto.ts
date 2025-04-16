import { ApiProperty } from '@nestjs/swagger';

class UpdateResultDto {
    @ApiProperty({ example: 1, description: '업데이트된 레코드 수' })
    affected: number; // 업데이트된 row 개수

    @ApiProperty({ example: [], description: 'Raw 쿼리 결과', type: [Object] })
    raw: any[];
}

export class ApproveCertificateDto {
    @ApiProperty({ type: UpdateResultDto }) // TypeORM의 update 메서드로 인해 반환됨
    userInfo1: UpdateResultDto;
}
