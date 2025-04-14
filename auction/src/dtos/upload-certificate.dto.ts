import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumberString } from "class-validator";

export class UploadCertificateDto {
    @ApiProperty({ example: '10', description: '등급명' })
    @IsString()
    grade: string;

    @ApiProperty({ example: '10', description: '점수' })
    @IsNumberString() // 파일 업로드 + multipart/form-data 조합에서는 IsNumberString가 더 안전
    score: string;

    @ApiProperty({ example: '100000', description: '최소가격' })
    @IsNumberString()
    price: string;

    @ApiProperty({ example: '12가3456', description: '차량 번호' })
    @IsString()
    vehicleNumber: string;
}
