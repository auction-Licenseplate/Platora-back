import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    // 회원가입 API
    @Post('/signup')
    async signUp(body: {email: string; password: string; name: string; phone: string}) {
        return this.authService.signUp(body.email, body.password, body.name, body.phone)
    }
}