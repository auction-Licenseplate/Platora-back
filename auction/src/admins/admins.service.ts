import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
@Injectable()
export class AdminsService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
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
}
