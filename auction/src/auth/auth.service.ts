import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';
import axios from 'axios';
import * as jwt from 'jsonwebtoken'; // JWT 라이브러리 사용

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
            throw new UnauthorizedException('200 유저 정보 없음.');
        }

        // 비밀번호 검증 (느낌표는 null일 가능성이 있는 것처럼 보이더라도 실제로 null이 아니라는 것을 알려줌)
        const match = await bcrypt.compare(password, user.password!);
        if(!match) {
            return { message: '200 비밀번호 불일치함' };
        }

        // 토큰 발급
        const payload = {id: user.id, email: user.email};
        const secretKey = process.env.JWT_SECRET || 'default_secret';
        const token = jwt.sign(payload, secretKey, {
            expiresIn: '1d', // 1일 동안 유효
        });

        // localstrategy에서 req.user로 데이터 넘김
        return { id: user.id, email: user.email, token };
    }
    
    async kakaoUser(code: string) {
        console.log("카카오 클라이언트 아이디:", process.env.KAKAO_CLIENT_ID);
        console.log("카카오 콜백 주소:", process.env.KAKAO_REDIRECT_URL);

        const KAKAO_TOKEN_URL = "https://kauth.kakao.com/oauth/token";
        const KAKAO_USER_INFO_URL = "https://kapi.kakao.com/v2/user/me";
    
        // 1. 인가 코드로 카카오에서 액세스 토큰 받아오기
        const tokenResponse = await axios.post(KAKAO_TOKEN_URL, null, {
            params: {
                // grant_type: "authorization_code",
                client_id: process.env.KAKAO_CLIENT_ID,
                client_secret: process.env.KAKAO_CLIENT_SECRET,
                redirect_uri: process.env.KAKAO_REDIRECT_URL,
                code: code,
            },
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).catch(error => {
            console.error("카카오 토큰 요청 실패:", error.response?.data || error.message);
        });
    
        const accessToken = tokenResponse?.data.access_token;
    
        // 2. 액세스 토큰으로 사용자 정보 받아오기
        const userResponse = await axios.get(KAKAO_USER_INFO_URL, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }).catch(error => {
            console.error("카카오 사용자 정보 요청 실패:", error.response?.data || error.message);
        });
    
        const kakaoAccount = userResponse?.data.kakao_account;
    
        let user = await this.userRepository.findOne({
            where: { email: kakaoAccount.email },
        });
    
        if (!user) {
            user = this.userRepository.create({
                email: kakaoAccount.email,
                provider: "kakao",
            });
            await this.userRepository.save(user);
        }
        console.log("카카오 사용자 정보:", userResponse?.data);
    
        return user;
    }

    // 네이버 로그인
    async naverUser(naver_account: string, name: string, phone: string){
        let user = await this.userRepository.findOne({ where: { email: naver_account } });
        if (!user) { // 유저가 없으면 새로 생성
            user = this.userRepository.create({
                email: naver_account,
                name,
                phone,
                provider: 'naver',
            });
            await this.userRepository.save(user);
        }
        return user;
    }

    // 구글 로그인
    async googleUser(google_account: string){
        let user = await this.userRepository.findOne({ where: { email: google_account } });
    
        if (!user) { // 유저가 없으면 새로 생성
            user = this.userRepository.create({
                email: google_account,
                provider: 'google',
            });
            await this.userRepository.save(user);
        }

        return user;
    }

    // sns JWT 토큰 발급
    async snsToken(user: any){
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

    // 아이디 찾기
    async findId(email:string, password:string){
        const user = await this.userRepository.findOne({where: {email, password}});
        if(!user){
            return { message: '저장된 아이디 없음' };
        }

        return { email: user.id };
    }
    // 비밀번호 찾기
    async findPW(email:string, phone:string){
        const user = await this.userRepository.findOne({where: {email, phone}});
        if(!user){
            return { message: '저장된 비밀번호 없음' };
        }

        return { userID: user.id };
    }
}
