import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Auctions } from 'src/entities/auctions';
import { Grades } from 'src/entities/grades';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Vehicles)
        private vehicleRepository: Repository<Vehicles>,
        @InjectRepository(Grades)
        private gradeRepository: Repository<Grades>,
        @InjectRepository(Auctions)
        private auctionRepository: Repository<Auctions>
    ) {}

    // 모든 게시글 정보 제공
    async getAllInfo(body: any){
        const auctions = await this.auctionRepository.find({
            relations: ['users', 'vehicle', 'grade_id']
        })
    }
}
