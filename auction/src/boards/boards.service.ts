import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auctions } from 'src/entities/auctions';
import { Favorites } from 'src/entities/favorites';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { Admins } from 'src/entities/admins';
import { Bids } from 'src/entities/bids';
import { Users } from 'src/entities/users.entity';
import { Alerts } from 'src/entities/alert';

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
    private userRepository: Repository<Users>,
    @InjectRepository(Alerts)
    private alertRepository: Repository<Alerts>
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
        'grade.min_price AS minPrice', // 최저금액
        'auction.id As auctionID', // 경매 아이디 (PK)
        'auction.final_price AS finalPrice', // 최종 가격
        'auction.end_time AS endTime', // 종료 시간
        'auction.start_time AS startTime', // 시작 시간
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
        'grade.min_price AS minPrice', // 최저금액
        'vehicle.car_img AS carImage', // 차량 이미지
        'vehicle.car_info AS carInfo', // 차량 상세 정보
      ])
      .where('user.id = :userId', { userId })
      .andWhere('admin.write_status = :status', { status: query.write_status })
      .getRawMany();

    return result;
  }

  // 승인 전 게시글 삭제
  async delPendingPost(postId: string){
    const post = await this.adminRepository
      .createQueryBuilder('admin')
      .leftJoin('admin.vehicle', 'vehicle')
      .where('vehicle.title = :postId', { postId })
      .andWhere('admin.write_status = :status', {status: 'waiting'})
      .getOne();
    
    if(!post){
      return {message: '해당 게시글 없음'}
    }

    await this.adminRepository.remove(post);
    return {message: '승인 전 게시글 삭제 완료'};
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
        'grade.min_price AS minPrice', // 최저금액
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

  // 해당 유저 데이터 전달
  async userData(userId: string) {
    return await this.auctionRepository
    .createQueryBuilder('au')
    .innerJoin('au.vehicle', 'vehicle')
    .innerJoin('au.user', 'user')
    .innerJoin('au.grade', 'grade')
    .where('user.id = :userId', { userId }) // 해당 사용자만
    .select([
      'au.final_price', // 최종가격
      'au.auction_num', // 경매번호
      'au.id', // 경매엔티티 PK
      'au.end_time', // 종료시간
      'vehicle.car_img', // 차량 이미지
      'vehicle.plate_num', // 번호판(제목)
      'grade.grade_name', // 등급명
      'grade.min_price', // 최저금액
    ])
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
        'user.id AS userId', // 판매자 PK
        'vehicle.title AS vehicleTitle', // 차량 제목
        'grade.grade_name AS gradeName', // 등급명
        'grade.min_price AS minPrice', // 최저금액
        'auction.final_price AS finalPrice', // 최종 가격
        'auction.end_time AS endTime', // 종료 시간
        'auction.status AS status', // 경매 상태
        'auction.id AS auctionID', // 경매 PK
        'vehicle.car_img AS carImage', // 차량 이미지
      ])
      .where('favUser.id = :userId', { userId }) // 해당 유저의 데이터만
      .andWhere('favorite.status = true') // status 일치 조건만
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
        'au.start_time',
        'au.auction_num', // 경매번호
        'au.id', // 경매엔티티 PK
        'registerUser.name',
        'registerUser.id', // 판매자 id
        'vehicle.car_info',
        'vehicle.car_img',
        'vehicle.plate_num', // 번호판
        'bid.create_at',
        'bidUser.name',
        'grade.price_unit' // 입찰단위
      ])
      .getRawMany();

    const lastBid = await this.bidRepository
      .createQueryBuilder('bid')
      .innerJoin('bid.user', 'user') // 입찰버튼 누른 사람
      .where('bid.auction = :auctionId', { auctionId })
      .orderBy('bid.create_at', 'DESC') // 가장 최근
      .select([
        'user.id AS bidUser_Id', // 입찰자 id (PK)
        'bid.bid_price AS bid_price' // 입찰가격
      ])
      .getRawOne();
    
    const currentUser = await this.userRepository.findOne({
      where: { id: Number(userId) },
      select: ['point', 'id'],
    })

    const favorite = await this.favoriteRepository
      .createQueryBuilder('fav')
      .where('fav.auction = :auctionId', { auctionId })
      .andWhere('fav.user = :userId', { userId: Number(userId) })
      .andWhere('fav.status = true')
      .getOne();
  
    return {
      data: result,
      isFavorite: favorite ? true : false,
      currentUserPoint: currentUser?.point,
      currentUserId: currentUser?.id,
      lastBid
    };
  }

  // 입찰 가격 갱신
  async updatePrice(auctionId: number, price: number, userId: string, prePrice?: number, preUserId?: string){
    // 해당 경매와 현재 입찰자 찾기
    const auction = await this.auctionRepository.findOne({
      where: {id: auctionId},
      relations: ['vehicle'],
    });
    const user = await this.userRepository.findOne({ where: { id: Number(userId) } });

    if (!auction || !user) {
      return { message: '경매 또는 유저 정보 없음' };
    }

    // 현재 사람의 point 차감하기
    if(user.point! < price) {
      return { message: '포인트 부족함'}
    }
    user.point! -= price;
    await this.userRepository.save(user);

    // auction 테이블의 최종 가격 갱신
    auction.final_price = price; 
    await this.auctionRepository.save(auction);

    // 이전 사람의 point 환불 및 bid 환불데이터 저장 (누적)
    let refundBid: Bids | null = null;  // 타입 명시
    if(preUserId && prePrice){
      const prevUser = await this.userRepository.findOne({where: {id: Number(preUserId)}})

      if(prevUser){
        prevUser.point! += prePrice;
        await this.userRepository.save(prevUser);
  
        refundBid = this.bidRepository.create({
          user: prevUser,
          auction,
          refund_bid_price: prePrice,
          type: 'refund',
        });

        await this.bidRepository.save(refundBid);

        // alert에 환불 데이터 저장
        const refundAlert = this.alertRepository.create({
          user: prevUser,
          vehicle: auction.vehicle,
          message: refundBid.type,
        })
        await this.alertRepository.save(refundAlert);
      }
    }

    // bid 경매데이터 저장 (입찰할 때마다 누적)
    const newBid = this.bidRepository.create({
      user,
      auction,
      bid_price: price,
      type: 'bid',
    });
    await this.bidRepository.save(newBid);

    // alert에 입찰 데이터 저장
    const bidAlert = this.alertRepository.create({
      user,
      vehicle: auction.vehicle,
      message: newBid.type
    })
    await this.alertRepository.save(bidAlert);

    return {message: '최종입찰가 갱신/입찰기록 저장/포인트처리 완료', newBid, refundBid};
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

  // 대시보드 정보 전달
  async dashInfo(){
    return await this.auctionRepository
      .createQueryBuilder('auction')
      .leftJoin('auction.bids', 'bid')
      .select([
        'auction.auction_num',
        'auction.final_price',
        'auction.end_time',
        'bid.auctionId AS bid_auctionId',
        'bid.create_at AS bid_createAt',
        'bid.bid_price AS bid_price',
      ])
      .orderBy('auction.id', 'DESC')
      .getRawMany()
  }
}
