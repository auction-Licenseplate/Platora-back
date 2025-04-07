import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auctions } from 'src/entities/auctions';
import { Favorites } from 'src/entities/favorites';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    @InjectRepository(Auctions)
    private auctionRepository: Repository<Auctions>,
    @InjectRepository(Favorites)
    private favoriteRepository: Repository<Favorites>,
  ) {}

  // 모든 게시글 정보 제공
  async getAllInfo() {
    return await this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.user', 'user')
      .leftJoinAndSelect('auction.vehicle', 'vehicle')
      .leftJoinAndSelect('auction.grade', 'grade')
      .select([
        'user.name AS userName', // 판매자명
        'vehicle.title AS vehicleTitle', // 차량 제목
        'vehicle.car_img AS imageUrl', // 차량 이미지
        'grade.grade_name AS gradeName', // 등급명
        'auction.id As auctionID', // 경매 아이디 (PK)
        'auction.final_price AS finalPrice', // 최종 가격
        'auction.end_time AS endTime', // 종료 시간
        'auction.status AS status', // 경매 상태
      ])
      .getRawMany(); // 결과 json 배열로 반환
  }

  async getMyPots(userId: string, query: any) {
    const result = await this.auctionRepository
      .createQueryBuilder('auction')
      .innerJoin('auction.vehicle', 'vehicle')
      .innerJoin('auction.grade', 'grade')
      .innerJoin('auction.user', 'user')
      .innerJoin('admins', 'admin', 'admin.auctionId = auction.id')
      .select([
        'user.name AS userName',
        'vehicle.title AS vehicleTitle',
        'vehicle.car_img AS carImage',
        'vehicle.car_info AS carInfo',
        'grade.grade_name AS gradeName',
      ])
      .where('user.id = :userId', { userId })
      .andWhere('auction.status = :status', { status: query.write_status })
      .getRawMany();

    return result;
  }

  // 승인 후 제공
  async getPosts(userId: string, query: any) {
    const statusArray = query.status ?? query['status[]'] ?? []; // status[] 고려

    return await this.auctionRepository
      .createQueryBuilder('auction')
      .innerJoin('auction.user', 'user')
      .innerJoin('auction.vehicle', 'vehicle')
      .innerJoin('auction.grade', 'grade')
      .select([
        'auction.id AS auctionId', // 경매 아이디
        'auction.auction_num AS auctionNum', // 경매 번호
        'user.name AS userName', // 판매자명
        'vehicle.title AS vehicleTitle', // 차량 제목
        'grade.grade_name AS gradeName', // 등급명
        'auction.final_price AS finalPrice', // 최종 가격
        'auction.end_time AS endTime', // 종료 시간
        'auction.status AS status', // 경매 상태
        'vehicle.car_img AS carImage', // 차량 이미지
        'vehicle.car_info AS carInfo', // 차량 상세 정보
      ])
      .where('user.id = :userId', { userId }) // 해당 유저의 데이터
      .andWhere('auction.status IN (:...status)', { status: statusArray }) // status 조건 적용
      .getRawMany();
  }

  // 관심상품 제공
  async getfavorite(userId: string) {
    return await this.favoriteRepository
      .createQueryBuilder('favorite')
      .innerJoin('favorite.auction', 'auction')
      .innerJoin('auction.user', 'user')
      .innerJoin('auction.vehicle', 'vehicle')
      .innerJoin('auction.grade', 'grade')
      .innerJoin('favorite.user', 'favUser')
      .select([
        'user.name AS userName', // 판매자명
        'vehicle.title AS vehicleTitle', // 차량 제목
        'grade.grade_name AS gradeName', // 등급명
        'auction.final_price AS finalPrice', // 최종 가격
        'auction.end_time AS endTime', // 종료 시간
        'auction.status AS status', // 경매 상태
        'vehicle.car_img AS carImage', // 차량 이미지
      ])
      .where('favUser.id = :userId', { userId }) // 해당 유저의 데이터만
      .getRawMany();
  }
}
