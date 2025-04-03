import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VehiclesService {
  private readonly ZEMINAR_API_KEY: string;

  constructor(
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
    private configService: ConfigService,
  ) {
    this.ZEMINAR_API_KEY =
      this.configService.get<string>('ZEMINAR_API_KEY') ?? '';
    console.log('ZEMINAR_API_KEY:', this.ZEMINAR_API_KEY); // 환경 변수 확인 로그
  }

  async getCarData(userId: number) {
    return this.vehicleRepository.find({
      where: { user: { id: userId } },
      select: ['plate_num', 'ownership_status'],
    });
  }

  // 작성글 저장
  async saveCarImg(userId: number, body: any, files: Express.Multer.File[]) {
    // 파일 이름으로 저장 (쉼표 구분)
    const filename = files.map((file) => file.filename).join(',');
    let vehicle = await this.vehicleRepository.findOne({
      where: { user: { id: userId }, plate_num: body.plate_num },
    });

    // 기존 차량 정보 업데이트
    vehicle!.title = body.title;
    vehicle!.car_info = body.car_info;
    vehicle!.car_img = filename;

    await this.vehicleRepository.save(vehicle!);
    return { message: '작성글 저장완료', vehicle };
  }
}
