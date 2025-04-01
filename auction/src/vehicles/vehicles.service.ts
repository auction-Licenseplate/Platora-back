import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';
import OpenAI from 'openai';
@Injectable()
export class VehiclesService {
  private readonly openai: OpenAI;
  constructor(
    @InjectRepository(Vehicles)
    private vehicleRepository: Repository<Vehicles>,
  ) {}

  // 차량 정보 제공
  async getCarData(userId: number) {
    const carData = await this.vehicleRepository.find({
      where: { user: { id: userId } },
      select: ['plate_num', 'ownership_status'],
    });

    return carData;
  }
}
