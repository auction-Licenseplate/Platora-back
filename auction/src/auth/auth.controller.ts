import { Body, Controller, Get, HttpCode, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { LocalLoginDto } from 'src/dtos/local-login.dto';
import { SocialLoginDto } from 'src/dtos/social-login.dto';
import { FindIdDto } from 'src/dtos/find-id.dto';
import { FindPasswordDto } from 'src/dtos/find-pwd.dto';
import { UpdatePasswordDto } from 'src/dtos/update-pwd.dto';
import { PlusInfoDto } from 'src/dtos/plus-info.dto';
import { CheckDuplicateDto } from 'src/dtos/check-duplicate.dto';
import { SocialPhoneCheckDto } from 'src/dtos/social-phon-check.dto';
import { SignUpDto } from 'src/dtos/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // 회원가입 API
  @Post('/signup')
  @ApiOperation({ summary: '회원가입' })
  @ApiResponse({ status: 200, schema:{ example: {message: '회원가입 성공', userEmail: 'user@example.com'}} })
  async signUp(@Body() body: SignUpDto) {
    const { email, password, name, phone } = body;
    return this.authService.signUp(email, password, name, phone);
  }

  // 로컬 로그인 API
  @HttpCode(200)
  @Post('/login')
  @UseGuards(AuthGuard('local'))
  @ApiOperation({ summary: '로컬 로그인' })
  @ApiBody({ type: LocalLoginDto})
  @ApiResponse({ status: 200,
    schema:{ example: {message: '로그인 성공', id: 1, email: 'user@example.com', token: '발급받은 jwt token'}} 
  })
  async login(@Req() req: any, @Res() res: any) {
    console.log("📦 로그인 응답 status: 200, user:", req.user);
    const { id, email, token } = req.user;
    if (!token) {
      return { message: '로그인 실패' };
    }
    
    res.cookie('accessToken', token, { // 쿠키에 토큰 저장
      // httpOnly: true,
      domain: '13.125.95.215',
      maxAge: 1000 * 60 * 60 * 24, // 1일 유지
    });
    return res.status(200).json({ message: '로그인 성공', id, email, token });
  }

  // 쿠키에서 토큰 꺼내기
  @Get('/tokenCheck')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: 'JWT 토큰 확인 (쿠키에서 accessToken 확인)' })
  @ApiResponse({ status: 200, schema:{ example: {message: '로그인 유지됨', token: '발급받은 jwt token'}}})
  async tokenCheck(@Req() req: Request) {
    // console.log("req.user 정보:", req.user);
    if (!req.cookies || !req.cookies.accessToken) {
      return { isAuthenticated: false, message: '토큰 없음' };
    }
    return { message: '로그인 유지됨', token: req.user };
  }

  // 카카오 로그인 API
  @Get('/kakao')
  @UseGuards(AuthGuard('kakao'))
  @ApiOperation({ summary: '카카오 로그인 (리다이렉트)' })
  async kakaoLogin(@Req() req: Request) {}

  // 네이버 로그인 API
  @Get('/naver')
  @UseGuards(AuthGuard('naver'))
  @ApiOperation({ summary: '네이버 로그인 (리다이렉트)' })
  async naverLogin(@Req() req: Request) {}

  // 구글 로그인 API
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: '구글 로그인 (리다이렉트)' })
  async googleLogin(): Promise<void> {}

  // sns 로그인 타입 구별
  @Post('login/:type')
  @ApiOperation({
    summary: 'SNS 로그인 완료 (토큰 발급)',
    description: 'SNS 로그인 API 사용'
  })
  @ApiParam({ name: 'type', enum: ['kakao', 'naver', 'google'], description: 'SNS 플랫폼 종류' })
  @ApiResponse({status: 200, 
    schema: {example: {
      user: {id: 1, email: 'user@example.com', provider: 'kakao'},
      token: {accessToken: 'jwt.access.token...', refreshToken: 'jwt.refresh.token...',}
    }}
  })
  async socialLogin(
    @Param('type') type: string,
    @Res() res: Response,
    @Body() body: SocialLoginDto,
  ) {
    // console.log(`프론트에서 받은타입 ${type}`);
    // console.log(`프론트에서 받은코드 ${body.code}`);
    let user;

    if (type === 'kakao') {
      user = await this.authService.kakaoUser(body.code);
    }
    if (type === 'naver') {
      user = await this.authService.naverUser(body.code);
    }
    if (type === 'google') {
      user = await this.authService.googleUser(body.code);
    }

    // jwt 토큰 발급
    const token = await this.authService.snsToken(user);

    // 쿠키에 저장
    res.cookie('accessToken', token.accessToken, {
      // httpOnly: true,
      domain: '13.125.95.215',
      maxAge: 1000 * 60 * 60 * 24, // 1일 유지
    });

    res.cookie('refreshToken', token.refreshToken, {
      // httpOnly: true,
      domain: '13.125.95.215',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    return res.json({ user, token });
  }

  // 아이디 찾기
  @Post('/findID')
  @ApiOperation({ summary: '아이디 찾기' })
  @ApiBody({ type: FindIdDto })
  @ApiResponse({ status: 200, schema: {example: {email: 'user@example.com'}}})
  async userID(@Body() body: { name: string; phone: string }) {
    return await this.authService.findId(body.name, body.phone);
  }

  // 비밀번호 찾기
  @Post('/findpw')
  @ApiOperation({ summary: '비밀번호 찾기' })
  @ApiResponse({ status: 200, schema: {example: {userID: 1}}})
  async userPW(@Body() body: FindPasswordDto) {
    const { email, phone } = body;
    return await this.authService.findPW(email, phone);
  }

  // 새 비밀번호 저장
  @Post('/pwfind/updatepw')
  @ApiOperation({ summary: '비밀번호 재설정' })
  @ApiBody({ type: UpdatePasswordDto })
  @ApiResponse({ status: 200, description: '새 비밀번호 저장 성공'})
  async pwFinde(@Body() body: { password: string; userID: number }) {
    return this.authService.updatePW(body.userID, body.password);
  }

  // 로그아웃 > 프론트에서 진행
  // @Post('/logout')
  // async logout(@Res() res: Response) {
  //   res.clearCookie('accessToken', {
  //     // httpOnly: true,
  //     sameSite: 'lax',
  //   });
  //   res.clearCookie('refreshToken');
  //   return res.send({ message: '토큰삭제 완료' });
  // }

  // 소셜로그인 추가 입력
  @Post('/social/plusinfo')
  @ApiOperation({ summary: '소셜 로그인 추가정보 입력' })
  @ApiResponse({ status: 200, description: '소셜로그인 추가정보 저장 성공'})
  async socialPlus(@Body() body: PlusInfoDto) {
    const { userID, name, phone } = body;
    return await this.authService.plusInfo(userID, name, phone);
  }

  // 회원가입 이메일, 번호 중복검사
  @Post('/check/:type')
  @ApiOperation({ summary: '회원가입 이메일 또는 번호 중복 검사' })
  @ApiParam({ name: 'type', enum: ['email', 'phone'], description: '중복 검사 종류' })
  @ApiResponse({ status: 200, schema: {example: {message: '사용 가능', type: 'email', exists: false}}})
  async duplicateData(@Param('type') type: string, @Body() body: CheckDuplicateDto) {
    const { email, phone } = body;
    let valueToCheck;

    if (type === 'email') valueToCheck = email;
    if (type === 'phone') valueToCheck = phone;

    return await this.authService.duplicateCheck(type, valueToCheck);
  }

  // 소셜로그인 추가입력 번호 중복검사
  @Post('/phoneCheck')
  @ApiOperation({ summary: '소셜 로그인 전화번호 중복 검사' })
  @ApiResponse({ status: 200, schema: {example: {message: '사용 가능', exists: false}}})
  async socialDuplicate(@Body() body: SocialPhoneCheckDto){
    const valueToCheck = body;
    return this.authService.socialDuplicateCheck(valueToCheck);
  }

  // 관리자 역할 확인
  @Get('/getRole')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '사용자 역할 확인' })
  @ApiResponse({ status: 200, schema: {example: {role : 'admin'}}})
  async userRole(@Req() req){
    const userId = req.user.id;
    return this.authService.getUserRole(userId);
  }
}
