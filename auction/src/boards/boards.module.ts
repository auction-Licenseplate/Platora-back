import { Module } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { BoardsController } from './boards.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Grades } from 'src/entities/grades';
import { Auctions } from 'src/entities/auctions';
import { Favorites } from 'src/entities/favorites';
import { Admins } from 'src/entities/admins';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Vehicles,
      Grades,
      Auctions,
      Favorites,
      Admins,
    ]),
  ],
  providers: [BoardsService],
  controllers: [BoardsController],
})
export class BoardsModule {}
