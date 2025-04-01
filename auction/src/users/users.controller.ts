import { Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface AuthRequest extends Request{
    user: {id: number};
}

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    // 사용자 정보 자동 출력
    @Get('/user-info')
    @UseGuards(AuthGuard('jwt'))
    async userInfo(@Req() req: AuthRequest) {
        const user = req.user;
        return await this.userService.getUserInfo(user.id);
    };

    @Get('/passCheck')
    @UseGuards(JwtAuthGuard)
    async passwordCheck(@Req() req) {
        const user = req.user;
        // console.log(user)
        return await this.userService.passChange(user.id);
    }

    @Post('/upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                cb(null, join(__dirname, '../../uploads'));
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}_${file.originalname}`);
            },
        }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req){
        console.log(file);
        // 파일 처리 로직
        const userId = req.user.id;
        return await this.userService.saveFile(userId, file.filename);
    }
}
