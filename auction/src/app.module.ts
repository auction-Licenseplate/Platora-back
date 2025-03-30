import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PayModule } from './pay/pay.module';

import { Users } from './entities/users.entity';
import { UserCheck } from './entities/user_check';
import { Vehicles } from './entities/vehicles';
import { Grades } from './entities/grades';
import { Auctions } from './entities/auctions';
import { Bids } from './entities/bids';
import { Payment } from './entities/payment';
import { Favorites } from './entities/favorites';
import { Admins } from './entities/admins';
import { Notifications } from './entities/notifications';
import { VehiclesModule } from './vehicles/vehicles.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      // 환경변수 설정 (배포, 개발 구분)
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? '.env.production'
          : '.env.development',
    }),
    TypeOrmModule.forRoot({
      // TypeORM 설정 (db 연결)
      type: 'mysql',
      host: 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [
        Users,
        UserCheck,
        Vehicles,
        Grades,
        Auctions,
        Bids,
        Payment,
        Favorites,
        Admins,
        Notifications,
      ],
      charset: 'utf8mb4',
      synchronize: process.env.NODE_ENV !== 'production', // 개발 환경에서만 true
    }),
    UsersModule,
    AuthModule,
    PayModule,
    VehiclesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
