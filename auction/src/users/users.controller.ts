import { Body, Controller, Delete, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AgreeCheckDto } from 'src/dtos/agree-check.dto';
import { UserInfoResponseDto } from 'src/dtos/user-info-res.dto';
import { PasswordCheckResponseDto } from 'src/dtos/pwd-check-res.dto';

interface AuthRequest extends Request{
    user: {id: number};
}
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    // 사용자 정보 자동 출력
    @Get('/user-info')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ summary: '사용자 마이페이지 정보 조회' })
    @ApiResponse({ status: 200, type: UserInfoResponseDto })
    async userInfo(@Req() req: AuthRequest) {
        const user = req.user;
        return await this.userService.getUserInfo(user.id);
    };

    // 비밀번호 변경 가능 여부 확인
    @Get('/passCheck')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '비밀번호 변경 가능 여부 확인' })
    @ApiResponse({ status: 200, type: PasswordCheckResponseDto })
    async passwordCheck(@Req() req) {
        const user = req.user;
        // console.log(user)
        return await this.userService.passChange(user.id);
    }

    // 이용약관 체크
    @Post('/userCheck')
    @ApiOperation({ summary: '이용약관 체크' })
    @ApiBody({ type: AgreeCheckDto})
    async agreeCheck(@Body() body: AgreeCheckDto){
        return await this.userService.userAgree(body.user_email, body.term);
    }

    // 회원 탈퇴
    @Delete('/withdraw')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: '회원 탈퇴' })
    async userDelete(@Req() req){
        const user = req.user;
        return await this.userService.userOut(user.id);
    }

    // 공인인증서 저장
    @ApiBearerAuth('accessToken')
    @Post('/certificate')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', {
        storage: diskStorage({
            destination: join(__dirname, '../../uploads'), // 저장할 경로
            filename: (req, file, callback) => {
                const filename = `${Date.now()}_${file.originalname}`;
                callback(null, filename);
            },
        }),
    }))
    @ApiConsumes('multipart/form-data') // multipart 형식 받는다고 Swagger에 알림
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                grade: { type: 'string', example: '10' },
                score: { type: 'string', example: '10' },
                price: { type: 'string', example: '100000'},
                vehicleNumber: { type: 'string', example: '12가3456' },
                file: {
                    type: 'string',
                    format: 'binary', // Swagger에 파일 업로드 필드로 인식
                }
            }
        }
    })
    @ApiOperation({ summary: '공인인증서(파일), 등급, 차량번호 저장' })
    async saveCertification(@UploadedFile() file: Express.Multer.File, @Body() body, @Req() req){
        if (!file) {
            return { message: '파일 없음' };
        }

        // 처리 로직
        const userId = req.user.id;
        return await this.userService.saveFile(userId, body, file);
    }
}
