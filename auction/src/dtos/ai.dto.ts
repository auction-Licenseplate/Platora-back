import { ApiProperty } from "@nestjs/swagger";

export class AiMessageDto {
    @ApiProperty({
        example: '123가 1234',
    })
    message: string;
}