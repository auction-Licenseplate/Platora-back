import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Vehicles } from 'src/entities/vehicles';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
        @InjectRepository(Vehicles)
        private vehicleRepository: Repository<Vehicles>
    ) {}

    // 마이페이지 정보 제공
    async getUserInfo(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['name', 'phone', 'email', 'point'], // 필요한 필드만
        })
        return user;
    }

    // 비밀번호 변경가능한지 체크
    async passChange(userId: number) {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['provider'],
        });

        return {provider: user?.provider || ''}
    }

    // 공인인증서 db 저장
    async saveFile(userId: number, body:any, file: Express.Multer.File){
        const filename = file.filename
        console.log('파일 경로:', filename);  // filePath 확인

        const user = await this.userRepository.findOne({where: { id: userId }})
        if(!user) {
            return { message: '유저정보 없음' };
        }

        user.certification = filename; // users에 공인인증서 저장
        await this.userRepository.save(user);
        
        const plateNum = body.vehicleNumber; // vehicle에 차량번호 저장
        const vehicle = await this.vehicleRepository.create({
            user,
            plate_num: plateNum
        });
        await this.vehicleRepository.save(vehicle);
        
        return {message: '인증 업로드 성공'};
    }
}
