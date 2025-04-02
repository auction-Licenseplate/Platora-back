import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
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

        await this.userRepository.save(user);
        
        return {message: '인증 업로드 성공'};
    }
}
