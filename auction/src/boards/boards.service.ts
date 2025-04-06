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
        'auction.final_price AS finalPrice', // 최종 가격
        'auction.end_time AS endTime', // 종료 시간
        'auction.status AS status', // 경매 상태
      ])
      .getRawMany(); // 결과 json 배열로 반환
  }

  // 승인 전 제공
  async getMyPots(userId: string, query: any) {
    return await this.vehicleRepository
      .createQueryBuilder('vehicle')
      .leftJoinAndSelect('vehicle.user', 'user')
      .leftJoin('vehicle.auctions', 'auction')
      .leftJoin('auction.admins', 'admin')
      .leftJoinAndSelect('vehicle.grades', 'grade')
      .select([
        'vehicle.title AS vehicleTitle', // 차량 제목
        'vehicle.car_img AS carImage', // 차량 이미지
        'vehicle.car_info AS carInfo', // 차량 상세 정보
        'grade.grade_name AS gradeName', // 등급명
      ])
      .where('user.id = :userId', { userId }) // 해당 유저의 데이터만
      .andWhere('admin.write_status = :write_status', {
        write_status: query.write_status,
      }) // status 조건 적용
      .getRawMany();
  }

  // 승인 후 제공
  async getPosts(userId: string, query: any) {
    return await this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoinAndSelect('auction.user', 'user')
      .leftJoinAndSelect('auction.vehicle', 'vehicle')
      .leftJoinAndSelect('auction.grade_id', 'grade')
      .select([
        'auction.auction_num AS auctionNum', // 경매 번호
        'user.name AS userName', // 판매자명
        'vehicle.title AS vehicleTitle', // 차량 제목
        'grade.grade_name AS gradeName', // 등급명
        'auction.final_price AS finalPrice', // 최종 가격
        'auction.end_time AS endTime', // 종료 시간
        'auction.status AS status', // 경매 상태
      ])
      .where('user.id = :userId', { userId }) // 해당 유저의 데이터만
      .andWhere('auction.status IN (:...status)', { status: query.status }) // status 조건 적용
      .getRawMany();
  }

  // 관심상품 제공
  async getfavorite(userId: string) {
    return await this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.auction', 'auction')
      .leftJoinAndSelect('auction.user', 'user')
      .leftJoinAndSelect('auction.vehicle', 'vehicle')
      .leftJoinAndSelect('auction.grade_id', 'grade')
      .select([
        'user.name AS userName', // 판매자명
        'vehicle.title AS vehicleTitle', // 차량 제목
        'grade.grade_name AS gradeName', // 등급명
        'auction.final_price AS finalPrice', // 최종 가격
        'auction.end_time AS endTime', // 종료 시간
        'auction.status AS status', // 경매 상태
      ])
      .where('user.id = :userId', { userId }) // 해당 유저의 데이터만
      .getRawMany();
  }
}
