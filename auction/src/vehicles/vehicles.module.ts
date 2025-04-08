import { Module } from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicles } from 'src/entities/vehicles';
import { Admins } from 'src/entities/admins';
import { AdminsModule } from '../admins/admins.module';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicles, Admins]), AdminsModule],

  providers: [VehiclesService],
  controllers: [VehiclesController],
})
export class VehiclesModule {}
