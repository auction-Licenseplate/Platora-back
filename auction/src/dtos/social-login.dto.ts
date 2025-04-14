import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class SocialLoginDto {
    @ApiProperty({
        example: 'C0Zc-q5eRfoK1bEbzWbGEcw9KgxqJy54GLvlSWhuEY7LDb6D4iB5gAAAAAQKFyIgAAABljMzmlaGtS2__sNdBQ',
        description: '발급받은 코드'
    })
    @IsString()
    code: string;
}