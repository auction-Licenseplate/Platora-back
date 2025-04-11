import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Admins } from 'src/entities/admins';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications, Users, Vehicles, Admins])],
  providers: [NotificationService],
  controllers: [NotificationController]
})
export class NotificationModule {}
