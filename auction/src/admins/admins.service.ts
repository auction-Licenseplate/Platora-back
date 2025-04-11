import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment';
import { Admins } from 'src/entities/admins';
import { Auctions } from 'src/entities/auctions';
import { Banners } from 'src/entities/banners';
import { Bids } from 'src/entities/bids';
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
    private auctionRepository: Repository<Auctions>,
    @InjectRepository(Banners)
    private bannerRepository: Repository<Banners>,
    @InjectRepository(Bids)
    private bidRepository: Repository<Bids>
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

  // 포인트 반환
  async returnpoint() {
    const rawData = await this.paymentRepository
      .createQueryBuilder('p')
      .select([
        'u.id AS id',
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
      userId: data.id,
      name: data.name || '이름 없음',
      email: data.email || '이메일 없음',
      account: data.account || '계좌 정보 없음',
      cardCompany: data.cardCompany || '카드사 정보 없음',
      amount: data.refundAmount || 0,
    }));

    // console.log('가공된 데이터:', formattedData); // 가공된 데이터 확인
    return formattedData;
  }

  // 포인트 환불상태 변경
  async approveRefund(userId: number){
    const payment = await this.paymentRepository.findOne({
      where: {
        user: {id: userId},
        refund_status: 'waiting',
      },
    });

    if(!payment){
      return { message: '해당 유저 환불대기 내역 없음' };
    }

    payment.refund_status = 'success'; // 환불상태 변경
    await this.paymentRepository.save(payment);
    
    return { message: '환불 상태 변경 완료'};
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
    return await this.bannerRepository.find({
      select: ['banner_title', 'banner_img'],
    });
  }
  async bannerGet2(){
    return await this.bannerRepository.find({
      select: ['banner_img', 'banner_title'],
      take: 3 // 3개 제한
    });
  }

  // 배너 추가
  async saveBanner(text: string, file: Express.Multer.File){
    if (!text || !file) {
      return {message: '제목과 이미지 없음'}
    }

    const banner = this.bannerRepository.create({
      banner_title: text,
      banner_img: file.filename
    })

    await this.bannerRepository.save(banner);
    return {message: '배너 저장 완료', banner};
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

  // 배너 삭제
  async imgdel(title: string){
    const banner = await this.bannerRepository.findOne({ where: {banner_title: title}})
    if(!banner){
      return {message: '해당 배너 없음'};
    }
    await this.bannerRepository.remove(banner);
    return {message: '배너 삭제 완료'};
  }

  // 경매 승인 
  async success(userId: number, plateNum: string){
    // 경매번호 랜덤생성
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let rnadomAuction = 'AUC-';
    for (let i = 0; i < 8; i++) {
      rnadomAuction += chars[Math.floor(Math.random() * chars.length)];
    }

    // 1. 유저와 차량 데이터 조회
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const vehicle = await this.vehicleRepository.findOne({
      where: { plate_num: plateNum },
      relations: ['grade'],
    });
    const grade = vehicle?.grade;
    
    if (!user || !vehicle) {
      return {message: '유저랑 차량 확인 불가능'}
    }

    // 2. Admins에 레코드 삽입
    let adminRecord = await this.adminRepository.findOne({
      where: {
        user: { id: user.id },
        vehicle: { id: vehicle.id },
        write_status: 'waiting',
      },
      relations: ['user', 'vehicle'],
    });
    
    if (adminRecord) { // 있으면 상태만 변경
      adminRecord.write_status = 'approved';
    } else { // 없으면 새로 생성
      adminRecord = this.adminRepository.create({
        user,
        vehicle,
        write_status: 'approved',
      });
    }

    await this.adminRepository.save(adminRecord);

    // 3. auctions에 레코드 삽입
    let auctionRecord = await this.auctionRepository.findOne({
      where: {
        user: { id: user.id },
        vehicle: { id: vehicle.id },
        status: 'before', // 아직 시작 안 된 경매만
      },
      relations: ['user', 'vehicle'],
    });

    if (!auctionRecord) { // 기존 경매 없으면 새로 생성
      auctionRecord = this.auctionRepository.create({
        user,
        vehicle,
        grade,
        auction_num: rnadomAuction,
        start_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3일 후
        end_time: new Date(Date.now() + 1000 * 60 * 60 * 24 * 8), // 8일 후
        status: 'before',
      });

      await this.auctionRepository.save(auctionRecord);

      // 4. bids에 레코드 삽입
      const bidRecord = this.bidRepository.create({
        user,
        auction: auctionRecord,
      })

      await this.bidRepository.save(bidRecord);

    }
    return { message: '경매 승인 성공' };
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
      // console.log('차량상태', approvedVehicle.ownership_status);
      return approvedVehicle.ownership_status;
    }

    return { message: '승인된 차량 없음' };
  }
}
