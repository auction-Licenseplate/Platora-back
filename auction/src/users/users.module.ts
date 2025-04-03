import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { UserCheck } from 'src/entities/user_check';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Vehicles, UserCheck])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
