import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Axios } from 'axios';
import { Users } from 'src/entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

    private NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
    private NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
    private NAVER_REDIRECT_URL = process.env.NAVER_REDIRECT_URL;

    // 일반 회원가입
    async signUp(email: string, password: string, name: string, phone: string) {
        // 이메일 중복 체크
        const existingUser = await this.userRepository.findOne({where: {email}});
        if(existingUser) {
            throw new Error('이미 존재하는 이메일입니다.');
        }
        
        const hashPW = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({
            email,
            password: hashPW,
            name,
            phone
        })

        await this.userRepository.save(newUser); // db에 저장

        return { message: '회원가입 성공' };
    }

}
