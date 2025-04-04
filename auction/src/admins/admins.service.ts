import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { Payment } from 'src/entities/payment';
@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
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
      { ownership_status: 'success' }, // 변경할 값
    );

    return { userInfo1 };
  }

  // 사용자 차량승인 상태 전달
  async carOwnership(userId: number) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!vehicle) {
      return { message: '차량정보 없음' };
    }

    console.log('차량상태', vehicle.ownership_status);
    return vehicle.ownership_status;
  }
}
