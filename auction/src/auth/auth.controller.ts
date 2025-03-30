import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { access } from 'fs';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    // 회원가입 API
    @Post('/signup')
    async signUp(@Body() body: {email: string; password: string; name: string; phone: string}) {
        return this.authService.signUp(body.email, body.password, body.name, body.phone)
    }

    // 로컬 로그인 API
    @Post('/login')
    @UseGuards(AuthGuard('local'))
    async login(@Req() req: any) {
        return req.user; // LocalStrategy의 validate가 반환한 유저 정보
    }
    
    // 카카오 로그인 API
    @Get('kakao')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLogin(@Req() req: Request){
        // 카카오로그인 페이지로 자동 리다이렉트
    }

    @Get('kakao/callback')
    @UseGuards(AuthGuard('kakao'))
    async kakaoLoginCallback(@Req() req){
        // 사용자 확인 후 토큰 발급
        const user = await this.authService.kakaoUser(req.user.email);
        const token = await this.authService.kakaoToken(user);

        return {
            message: "카카오 로그인 성공",
            user,
            accessToken: token.accessToken,
            refreshToken: token.refreshToken
        }
    }
}
