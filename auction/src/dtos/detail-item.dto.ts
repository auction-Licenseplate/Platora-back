import { ApiProperty } from '@nestjs/swagger';

export class DetailItemDto {
    @ApiProperty({ example: 5000000, description: '최종 가격' })
    au_final_price: number;

    @ApiProperty({ example: '2025-05-01T12:00:00.000Z', description: '종료 시간' })
    au_end_time: string;

    @ApiProperty({ example: 'AUC-2024-001', description: '경매 번호' })
    au_auction_num: string;

    @ApiProperty({ example: '1', description: '경매 ID (PK)' })
    au_id: number;

    @ApiProperty({ example: '홍길동', description: '판매자 이름' })
    registerUser_name: string;

    @ApiProperty({ example: '2', description: '판매자 ID' })
    registerUser_id: number;

    @ApiProperty({ example: '차량연도~', description: '차량 상세 정보' }) 
    vehicle_car_info: string;

    @ApiProperty({ example: 'car1.jpg', description: '차량 이미지 파일명' }) 
    vehicle_car_img: string;

    @ApiProperty({ example: '12가3456', description: '차량 번호판' })
    vehicle_plate_num: string;

    @ApiProperty({ example: '2025-04-25T12:00:00.000Z', description: '입찰 시간' })
    bid_create_at: string;

    @ApiProperty({ example: '김입찰', description: '입찰자 이름' })
    bidUser_name: string;

    @ApiProperty({ example: 5000, description: '입찰 단위' })
    grade_price_unit: number;
}

export class LastBidDto {
    @ApiProperty({ example: '15', description: '입찰 사용자 ID (PK)' }) 
    bidUser_Id: string;
    
    @ApiProperty({ example: '8000', description: '입찰 가격' })
    bid_price: number;
}

export class DetailResponseDto {
    @ApiProperty({ type: [DetailItemDto] }) data: DetailItemDto[];

    @ApiProperty({ example: 'true', description: '좋아요 여부' }) 
    isFavorite: boolean;

    @ApiProperty({ example: '300', description: '상세페이지 확인한 사용자 포인트' })
    currentUserPoint: number;

    @ApiProperty({ example: '3', description: '상세페이지 확인한 사용자 Id (PK)' }) 
    currentUserId: number;

    @ApiProperty({ type: LastBidDto }) lastBid: LastBidDto;
}
