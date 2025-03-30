import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicles])],
  providers: [VehiclesService],
  controllers: [VehiclesController]
})
export class VehiclesModule {}
