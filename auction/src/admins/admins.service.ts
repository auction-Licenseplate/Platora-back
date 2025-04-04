import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>
  ) {}

  // 일반 회원가입
  async userinfo() {
    // 전체 유저 정보 가져오기
    const userInfo1 = await this.userRepository.find();
    const userInfo = userInfo1.map((user) => ({
      email: user.email,
      name: user.name,
      phone: user.phone,
    }));
    console.log(userInfo);
    return { message: '회원가입 성공', userInfo };
  }

  // 사용자 차량승인 상태 전달
  async carOwnership(userId: number){
    const vehicle = await this.vehicleRepository.findOne({ where: {user: {id:userId}}});
    if(!vehicle){
      return {message: '차량정보 없음'};
    }

    console.log('차량상태', vehicle.ownership_status);
    return vehicle.ownership_status;
  }
}
