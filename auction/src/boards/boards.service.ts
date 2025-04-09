import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auctions } from 'src/entities/auctions';
import { Favorites } from 'src/entities/favorites';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { Admins } from 'src/entities/admins';
import { Bids } from 'src/entities/bids';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Auctions)
    private auctionRepository: Repository<Auctions>,
    @InjectRepository(Favorites)
    private favoriteRepository: Repository<Favorites>,
    @InjectRepository(Admins)
    private readonly adminRepository: Repository<Admins>,
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    @InjectRepository(Bids)
    private bidRepository: Repository<Bids>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>
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

  // 승인 전 제공
  async getMyPots(userId: string, query: any) {
    const result = await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoin('admin.vehicle', 'vehicle')
      .leftJoin('admin.user', 'user')
      .leftJoin('admin.auction', 'auction')
      .leftJoin('vehicle.grade', 'grade')
      .select([
        'user.name AS userName', // 판매자명
        'vehicle.title AS vehicleTitle', // 차량 제목
        'grade.grade_name AS gradeName', // 등급명
        'grade.min_price AS finalPrice', // 시작가
        'vehicle.car_img AS carImage', // 차량 이미지
        'vehicle.car_info AS carInfo', // 차량 상세 정보
      ])
      .where('user.id = :userId', { userId })
      .andWhere('admin.write_status = :status', { status: query.write_status })
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
        'auction.id AS auctionID', // 경매 PK
        'vehicle.car_img AS carImage', // 차량 이미지
      ])
      .where('favUser.id = :userId', { userId }) // 해당 유저의 데이터만
      .getRawMany();
  }

  // 상세페이지 전달
  async getDetailInfo(auctionId: string, userId: string) {
    const result = await this.auctionRepository
      .createQueryBuilder('au')
      .innerJoin('au.user', 'registerUser') // 등록한 사람
      .innerJoin('au.vehicle', 'vehicle')
      .innerJoin('au.bids', 'bid')
      .innerJoin('bid.user', 'bidUser') // 입찰한 사람
      .innerJoin('au.grade', 'grade')
      .where('au.id = :auctionId', { auctionId })
      .select([
        'au.final_price',
        'au.end_time',
        'au.auction_num', // 경매번호
        'au.id', // 경매엔티티 PK
        'registerUser.name',
        'vehicle.car_info',
        'vehicle.car_img',
        'vehicle.plate_num', // 번호판
        'bid.bid_count',
        'bid.create_at',
        'bidUser.name',
        'grade.price_unit' // 입찰단위
      ])
      .getRawMany();

    const isFavorite = await this.favoriteRepository
      .createQueryBuilder('fav')
      .where('fav.auction = :auctionId', {auctionId})
      .andWhere('fav.user = :userId', {userId})
      .getCount();
  
    return {
      data: result,
      isFavorite: isFavorite > 0, // 0이면 false, 1이상이면 true로 보냄
      userId
    };
  }

  // 입찰 가격 갱신
  async updatePrice(auctionId: number, price: number){
    // auctions에서 해당 경매 찾고 가격 갱신
    const auction = await this.auctionRepository.findOne({
      where: {id: auctionId}
    });

    if(!auction){
      return {meassage: '해당 경매 없음'}
    }

    auction.final_price = price; 
    await this.auctionRepository.save(auction);

    // bids에서 해당 경매 찾고 횟수 갱신
    const bid = await this.bidRepository.findOne({
      where: { auction: { id: auctionId } },
      relations: ['auction'],
    });

    if(!bid){
      return {message: '입찰정보 찾을 수 없음'}      
    }

    bid.bid_count += 1;
    await this.bidRepository.save(bid);

    return {message: '입찰가/횟수 갱신 완료'};
  }

  // 좋아요 업데이트
  async updateLike(auctionId: number, userId: string){
    const numUserId = Number(userId); // 타입 맞춰서 진행해야함

    const user = await this.userRepository.findOne({ where: { id: numUserId } });
    const auction = await this.auctionRepository.findOne({ where: { id: auctionId } });

    if (!user || !auction) {
      return { message: '유저랑 경매 정보 없음' };
    }

    const existingFavorite = await this.favoriteRepository.findOne({
      where: {
        user: { id: numUserId },
        auction: { id: auctionId },
      },
      relations: ['user', 'auction'],
    });

    if (existingFavorite) { // 토글 진행
      existingFavorite.status = !existingFavorite.status;
      await this.favoriteRepository.save(existingFavorite);
      return { 
        message: existingFavorite.status ? '좋아요 등록 완료' : '좋아요 취소 완료',
        status: existingFavorite.status,
       };
    }

    const favorite = this.favoriteRepository.create({
      user,
      auction,
      status: true,
    });
    await this.favoriteRepository.save(favorite);

    return { message: '좋아요 등록 완료', status: true };
  }
}
