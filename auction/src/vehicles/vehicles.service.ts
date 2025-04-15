import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Admins } from 'src/entities/admins';

@Injectable()
export class VehiclesService {
  gradeRepository: any;
  constructor(
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    private configService: ConfigService,

    @InjectRepository(Admins)
    private readonly adminsRepository: Repository<Admins>,
  ) {}

  // 차량 정보 전달
  async getCarData(userId: number) {
    return this.vehicleRepository.find({
      where: { user: { id: userId } },
      select: ['plate_num', 'ownership_status', 'create_at'],
    });
  }

  // 작성글 저장
  async saveCarImg(userId: number, body: any, files: Express.Multer.File[]) {
    // 파일 이름으로 저장 (쉼표 구분)
    const filename = files.map((file) => file.filename).join(',');

    const vehicle = await this.vehicleRepository.findOne({
      where: {
        plate_num: body.title,
        ownership_status: 'approved',
        user: { id: userId },
      },
      relations: ['grade'],
    });

    if (!vehicle) {
      return {message: '만족하는 차량 없음'};
    }

    const grade = vehicle.grade;

    // 기존 차량 정보 업데이트
    vehicle.title = body.title;
    vehicle.car_info = body.car_info;
    vehicle.car_img = filename;

    await this.vehicleRepository.save(vehicle);

    let adminEntry = await this.adminsRepository.findOne({
      where: {
        vehicle: { id: vehicle.id },
        user: { id: userId },
      },
      relations: ['user'],
    });

    if (adminEntry) {
      // 이미 있으면 업데이트
      adminEntry.write_status = 'waiting';
    } else {
      // 없으면 새로 생성
      adminEntry = this.adminsRepository.create({
        user: { id: userId },
        vehicle: { id: vehicle.id },
        grade,
        write_status: 'waiting',
      });
    }

    await this.adminsRepository.save(adminEntry);

    return { message: '작성글 저장완료', vehicle };
  }

  // 등록 시 번호판 승인 여부 검사
  async checkIfPlateIsApproved(plate_num: string, userId: string){
    if (!plate_num || plate_num.trim() === '') {
      return { isApproved: false, alreadyWritten: false };
    }

    const existing = await this.vehicleRepository.findOne({
      where: {
        plate_num,
        ownership_status: 'approved',
        user: { id: Number(userId) },
      },
    });

    const existingWrite = await this.vehicleRepository.findOne({
      where: {
        title: plate_num, // title이랑 plate_num이 같을 경우를 찾아 보내주기
        user: { id: Number(userId) },
      },
    });

    const otherUsers = await this.vehicleRepository.find({
      where: { title: plate_num },
      relations: ['user'],
    });

    const anotherUser = otherUsers.some(
      (vehicle) => vehicle.user.id !== Number(userId),
    );

    return { isApproved: !!existing, alreadyWritten: !!existingWrite, anotherUser };
  }
}
