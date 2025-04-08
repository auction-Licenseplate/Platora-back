import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Grades } from 'src/entities/grades';
import { UserCheck } from 'src/entities/user_check';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { In, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    @InjectRepository(UserCheck)
    private userCheckRepository: Repository<UserCheck>,
    @InjectRepository(Grades)
    private gradeRepository: Repository<Grades>,
  ) {}

  // 마이페이지 정보 제공
  async getUserInfo(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['name', 'phone', 'email', 'point', 'provider'], // 필요한 필드만
    });
    return user;
  }

  // 비밀번호 변경가능한지 체크
  async passChange(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      select: ['provider'],
    });

    return { provider: user?.provider || '' };
  }

  // 이용약관 저장
  async userAgree(userEmail: string, term: string) {
    const user = await this.userRepository.findOne({
      where: { email: userEmail },
    });
    if (!user) {
      return { message: '유저정보 없음' };
    }

    const checking = this.userCheckRepository.create({
      user: user,
      term: term,
    });

    await this.userCheckRepository.save(checking);
    return { message: '이용약관 저장 완료' };
  }

  // 회원탈퇴
  async userOut(userId: number) {
    await this.userRepository.delete({ id: userId });
    return { message: '회원 탈퇴 완료' };
  }

  // 공인인증서 db 저장
  async saveFile(userId: number, body: any, file: Express.Multer.File) {
    console.log(body.grade, body.score, body.price);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return { message: '유저정보 없음' };
    }

    // 이미 등록된 번호판인지
    const existingVehicle = await this.vehicleRepository.findOne({
      where: { plate_num: body.vehicleNumber},
    });

    const status = existingVehicle?.ownership_status?.trim();

    if (status === 'approved') {
      return { success: false, message: '이미 등록된 차량입니다.' };
    } else if (status === 'waiting') {
      return { success: false, message: '승인 대기 중인 차량입니다.' };
    }

    // users에 공인인증서 저장
    const filename = file.filename;
    user.certification = filename;
    await this.userRepository.save(user);

    // grade에 데이터 저장
    const newGrade = this.gradeRepository.create({
      grade_name: body.grade,
      price_unit: Number(body.score)*100,
      min_price: Number(body.price),
    });
    await this.gradeRepository.save(newGrade);

    // vehicle에 차량번호 저장
    const plateNum = body.vehicleNumber;
    const vehicle = this.vehicleRepository.create({
      user,
      plate_num: plateNum,
      grade: newGrade,
    });
    await this.vehicleRepository.save(vehicle);

    return { message: '인증 업로드 및 등급저장 성공' };
  }
}
