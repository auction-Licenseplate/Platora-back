import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Grades } from 'src/entities/grades';
import { Auctions } from 'src/entities/auctions';
import { Favorites } from 'src/entities/favorites';
import { Admins } from 'src/entities/admins';
import { Bids } from 'src/entities/bids';
import { Vehicles } from 'src/entities/vehicles';

@Module({
  imports: [TypeOrmModule.forFeature([ Users, Grades, Auctions, Favorites, Admins, Vehicles, Bids])],
  providers: [BoardsService],
  controllers: [BoardsController],
})
export class BoardsModule {}
