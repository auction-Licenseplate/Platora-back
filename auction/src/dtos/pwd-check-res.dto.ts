import { ApiProperty } from '@nestjs/swagger';

export class PasswordCheckResponseDto {
    @ApiProperty({ example: 'local', description: 'local일 경우만 가능)' })
    provider: string;
}
