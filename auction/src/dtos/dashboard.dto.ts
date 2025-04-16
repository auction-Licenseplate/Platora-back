import { ApiProperty } from '@nestjs/swagger';

export class DashboardItemDto {
    @ApiProperty({ example: 'AUC-2024-001', description: '경매 번호' })
    auction_auction_num: string;
  
    @ApiProperty({ example: 5000000, description: '최종 가격' })
    auction_final_price: number;
  
    @ApiProperty({ example: '2025-05-01T12:00:00.000Z', description: '종료 시간' })
    auction_end_time: string;
  
    @ApiProperty({ example: 1, description: '입찰된 경매 ID' })
    bid_auctionId: number;
  
    @ApiProperty({ example: '2025-04-29T12:00:00.000Z', description: '입찰 시간' })
    bid_createAt: string;
  
    @ApiProperty({ example: 1500000, description: '입찰 가격' })
    bid_bid_price: number;
  }
  