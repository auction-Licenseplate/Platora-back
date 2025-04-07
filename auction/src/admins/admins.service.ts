import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment';
import { Admins } from 'src/entities/admins';
import { Auctions } from 'src/entities/auctions';
@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(Admins)
    private adminRepository: Repository<Admins>,
    @InjectRepository(Auctions)
    private auctionRepository: Repository<Auctions>
  ) {}

  // 회원 관리
  async userinfo() {
    // 전체 유저 정보 가져오기
    const userInfo1 = await this.userRepository.find();
    const userInfo = userInfo1.map((user) => ({
      email: user.email,
      name: user.name,
      phone: user.phone,
    }));

    return { userInfo };
  }

  // 공동인증서 데이터
  async fileinfo() {
    return this.vehicleRepository
      .createQueryBuilder('v')
      .select(['u.name', 'u.certification', 'v.plate_num', 'u.email', 'u.id'])
      .innerJoin('v.user', 'u')
      .where('v.ownership_status = :status', { status: 'waiting' })
      .getRawMany();
  }

  // 포인트 반환 승인
  async returnpoint() {
    const rawData = await this.paymentRepository
      .createQueryBuilder('p')
      .select([
        'u.name AS name',
        'u.email AS email',
        'p.account AS account',
        'p.card_company AS cardCompany',
        'p.refund_amount AS refundAmount',
      ])
      .innerJoin('p.user', 'u')
      .where('p.refund_status = :status', { status: 'success' })
      .getRawMany();

    const formattedData = rawData.map((data) => ({
      name: data.name || '이름 없음',
      email: data.email || '이메일 없음',
      account: data.account || '계좌 정보 없음',
      cardCompany: data.cardCompany || '카드사 정보 없음',
      amount: data.refundAmount || 0,
    }));

    console.log('가공된 데이터:', formattedData); // 가공된 데이터 확인
    return formattedData;
  }

  //공동인증서 승인
  async pendding(userId: number) {
    // 승인 상태 업데이트
    const userInfo1 = await this.vehicleRepository.update(
      { user: { id: userId }, ownership_status: 'waiting' }, // 조건
      { ownership_status: 'approved' }, // 변경할 값
    );

    return { userInfo1 };
  }

  // 배너 이미지 전달
  async bannerGet() {
    return await this.adminRepository.find({
      select: ['title', 'img'],
    });
  }
  async bannerGet2(){
    return await this.adminRepository.find({
      select: ['img'],
      take: 3 // 3개 제한
    });
  }

  // 경매 물품 전달
  async itemInfo() {
    return await this.vehicleRepository
      .createQueryBuilder('v')
      .select([
        'v.title',
        'v.car_img',
        'v.plate_num',
        'u.email',
        'u.id',
        'u.name',
      ])
      .innerJoin('v.user', 'u')
      .getRawMany();
  }

  // 경매 승인 
  async success(userId: number, platenum: string){
    const writeStatus = await this.adminRepository.update(
      {user: {id: userId}, write_status: 'pending'}, // 조건
      {write_status: 'approved'} // 변경할 값
    )

    return { writeStatus };
  }

  // 회원탈퇴
  async userDelete(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      return { message: '사용자 없음' };
    }
    await this.userRepository.remove(user);
    return { message: '사용자 탈퇴 완료' };
  }

  // 상세페이지 전달
  async getDetailInfo(auctionId: number){
    const auction = await this.auctionRepository
      .createQueryBuilder('au')
      .innerJoin('au.user', 'registerUser') // 등록한 사람
      .innerJoin('au.vehicle', 'vehicle')
      .innerJoin('au.bids', 'bid')
      .innerJoin('bid.user', 'bidUser') // 입찰한 사람
      .where('au.id = :auctionId', {auctionId})
      .select([
        'au.final_price',
        'au.end_time',
        'au.auction_num',
        'registerUser.name',
        'vehicle.car_info',
        'vehicle.car_img',
        'bid.bid_count',
        'bid.create_at',
        'bidUser.name'
      ])
      .getRawMany();

      return auction;
  }

  // 사용자 차량승인 상태 전달 (프론트)
  async carOwnership(userId: number) {
    const vehicles = await this.vehicleRepository.find({
      where: { user: { id: userId } },
    });

    if (!vehicles || vehicles.length === 0) {
      return { message: '차량정보 없음' };
    }

    const approvedVehicle = vehicles.find(
      (vehicle) => vehicle.ownership_status === 'approved',
    );

    if (approvedVehicle) {
      console.log('차량상태', approvedVehicle.ownership_status);
      return approvedVehicle.ownership_status;
    }

    return { message: '승인된 차량 없음' };
  }
}
