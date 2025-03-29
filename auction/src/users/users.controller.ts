import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    // 마이페이지 정보 요청
    @Get('/user-info')
    @UseGuards(JwtAuthGuard)
    async userInfo(@Req() req) {
        const user = req.user;
        // console.log('사용자id 확인용: ', user);
        return await this.userService.getUserInfo(user.id);
    };

    // 비밀번호 검증
    @Get('/passCheck')
    @UseGuards(JwtAuthGuard)
    async passwordCheck(@Req() req) {
        const user = req.user;
        return await this.userService.passChange(user.id);
    }
}
