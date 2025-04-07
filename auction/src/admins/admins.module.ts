import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Payment } from 'src/entities/payment';
import { Admins } from 'src/entities/admins';
@Module({
  imports: [TypeOrmModule.forFeature([Users, Vehicles, Payment, Admins])],
  providers: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}
