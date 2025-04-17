import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notifications } from 'src/entities/notifications';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Admins } from 'src/entities/admins';
import { Alerts } from 'src/entities/alert';
import { Auctions } from 'src/entities/auctions';
import { Bids } from 'src/entities/bids';

@Module({
  imports: [TypeOrmModule.forFeature([Notifications, Users, Vehicles, Admins, Alerts, Auctions, Bids])],
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
