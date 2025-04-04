import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { UserCheck } from 'src/entities/user_check';
import { Grades } from 'src/entities/grades';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Vehicles, UserCheck, Grades])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
