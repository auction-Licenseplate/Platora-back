import { ApiProperty } from '@nestjs/swagger';

export class PasswordCheckResponseDto {
    @ApiProperty({ example: ' ', description: 'local일 경우(null)만 가능' })
    provider: string;
}
