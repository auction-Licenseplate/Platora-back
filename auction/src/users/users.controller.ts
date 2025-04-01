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

    // 비밀번호 변경 가능 여부 확인
    @Get('/passCheck')
    @UseGuards(JwtAuthGuard)
    async passwordCheck(@Req() req) {
        const user = req.user;
        // console.log(user)
        return await this.userService.passChange(user.id);
    }

    // 공인인증서 저장
    @Post('/upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: (req, file, cb) => {
                const uploadPath = join(__dirname, '../../uploads');
                console.log('업로드 경로:', uploadPath); // 경로 확인
                cb(null, uploadPath); // 파일 저장 경로
                // cb(null, join(__dirname, '../../uploads'));
            },
            filename: (req, file, cb) => {
                const filename = `${Date.now()}_${file.originalname}`;
                console.log('저장될 파일 이름:', filename); // 파일 이름 확인
                cb(null, filename);
                // cb(null, `${Date.now()}_${file.originalname}`);
            },
        }),
    }))
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req){
        console.log('업로드된 파일:', file);  // 업로드된 파일 정보 확인
        if (!file) {
            return { message: '파일이 없습니다' };
        }

        // 파일 처리 로직
        const userId = req.user.id;
        console.log('유저 ID:', userId);  // 유저 ID 확인
        return await this.userService.saveFile(userId, file.filename);
    }
}
