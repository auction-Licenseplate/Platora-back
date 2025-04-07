import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    private configService: ConfigService,
  ) {}

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
        plate_num: body.plate_num,
        ownership_status: 'approved',
      },
    });

    // 기존 차량 정보 업데이트
    vehicle!.title = body.title;
    vehicle!.car_info = body.car_info;
    vehicle!.car_img = filename;

    await this.vehicleRepository.save(vehicle!);
    return { message: '작성글 저장완료', vehicle };
  }

  // 등록 시 번호판 승인 여부 검사
  async checkIfPlateIsApproved(plate_num: string): Promise<{ isApproved: boolean; alreadyWritten: boolean }> {
    const existing = await this.vehicleRepository.findOne({
      where: {
        plate_num,
        ownership_status: 'approved',
      },
    });

    const existingWrite = await this.vehicleRepository.findOne({
      where: {
        title: plate_num, // title이랑 plate_num이 같을 경우를 찾아 보내주기
      },
    });

    return { isApproved: !!existing, alreadyWritten: !!existingWrite };
  }
}
