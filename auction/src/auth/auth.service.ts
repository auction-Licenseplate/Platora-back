import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ) {}

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

    // 일반 로그인
    async localLogin(email: string, password: string) {
        // 유저 정보 확인
        const user = await this.userRepository.findOne({ where:{email}});
        if(!user) {
            return { message: '200 유저정보 없음' };
        }

        // 비밀번호 검증 (느낌표는 null일 가능성이 있는 것처럼 보이더라도 실제로 null이 아니라는 것을 알려줌)
        const match = await bcrypt.compare(password, user.password!);
        if(!match) {
            return { message: '200 비밀번호 불일치함' };
        }

        // 토큰 발급
        const payload = {id: user.id, email: user.email};
        return {
            message: '로그인 성공',
            token: this.jwtService.sign(payload),
        };
    }

    // 카카오 유저 확인
    async kakaoUser(kakao_account: string) {
        let user = await this.userRepository.findOne({ where: { email: kakao_account } });
    
        if (!user) { // 유저가 없으면 새로 생성
            user = this.userRepository.create({
                email: kakao_account,
                provider: 'kakao',
            });
            await this.userRepository.save(user);
        }
    
        return user;
    }

    // 카카오 JWT 토큰 발급
    async kakaoToken(user: any){
        const payload = { 
            id: user.id,
            email: user.email, 
            provider: user.provider 
        };
        const accessToken = this.jwtService.sign(payload, { expiresIn: "1h" });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: "7d" });
        
        // refresh 토큰 db 저장?
        // user.refreshToken = refreshToken;
        // await this.userRepository.save(user);

        return { accessToken, refreshToken };
    }
}
