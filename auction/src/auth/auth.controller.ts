import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    // 회원가입 API
    @Post('/signup')
    async signUp(@Body() body: {email: string; password: string; name: string; phone: string}) {
        return this.authService.signUp(body.email, body.password, body.name, body.phone)
    }

    // 로컬 로그인 API
    @UseGuards(AuthGuard('local'))
    @Post('/loginLocal')
    async login(@Req() req: any) {
        return req.user; // LocalStrategy의 validate가 반환한 유저 정보
    }
    
}
