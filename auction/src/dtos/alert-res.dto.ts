import { ApiProperty } from '@nestjs/swagger';

export class AlertResponseDto {
    @ApiProperty({ example: 1, description: '알림 ID' })
    id: number;

    @ApiProperty({ example: 'refund', description: '알림 메시지 타입' })
    message: string;

    @ApiProperty({ example: false, description: '알림 확인 여부' })
    check: boolean;

    @ApiProperty({ example: '2025-04-15T12:34:56.789Z', description: '알림 생성일' })
    created_at: Date;

    @ApiProperty({ example: 3, description: '해당 알림의 차량 ID' })
    vehicleId: number;
    
    @ApiProperty({ example: '12가1234', description: '해당 알림의 차량 제목' })
    vehicleTitle: string;
}
