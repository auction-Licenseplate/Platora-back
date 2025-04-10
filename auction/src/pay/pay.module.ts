import { Module } from '@nestjs/common';
import { PayService } from './pay.service';
import { PayController } from './pay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from 'src/entities/payment';
import { Users } from 'src/entities/users.entity';
import { Bids } from 'src/entities/bids';

@Module({
  imports: [TypeOrmModule.forFeature([Payment, Users, Bids])],
  providers: [PayService],
  controllers: [PayController]
})
export class PayModule {}
