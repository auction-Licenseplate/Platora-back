import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { AdminsController } from './admins.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  providers: [AdminsService],
  controllers: [AdminsController],
})
export class AdminsModule {}
