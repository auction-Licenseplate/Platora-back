import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities/users.entity';
import axios from 'axios';
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
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new Error('이미 존재하는 이메일입니다.');
    }

    const hashPW = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      email,
      password: hashPW,
      name,
      phone,
    });

    await this.userRepository.save(newUser); // db에 저장
    const userEmail = newUser.email;
    return { message: '회원가입 성공', userEmail };
  }

  // 일반 로그인
  async localLogin(email: string, password: string) {
    // 유저 정보 확인
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('200 유저 정보 없음.');
    }

    // 비밀번호 검증 (느낌표는 null일 가능성이 있는 것처럼 보이더라도 실제로 null이 아니라는 것을 알려줌)
    const match = await bcrypt.compare(password, user.password!);
    if (!match) {
      return { message: '200 비밀번호 불일치함' };
    }

    // 토큰 발급
    const payload = { id: user.id, email: user.email };
    const secretKey = process.env.JWT_SECRET || 'default_secret';
    const newToken = this.jwtService.sign(payload, {
      secret: secretKey,
      expiresIn: '1d',
    });
    // console.log("새로 발급된 토큰:", newToken);
    return { id: user.id, email: user.email, token: newToken };
  }

  // 카카오 로그인
  async kakaoUser(code: string) {
    console.log('카카오 로그인 받은 코드:', code);

    const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
    const KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

    // 1. 코드로 카카오에서 액세스 토큰 받아오기
    const tokenResponse = await axios
      .post(KAKAO_TOKEN_URL, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: process.env.KAKAO_CLIENT_ID,
          client_secret: process.env.KAKAO_CLIENT_SECRET,
          redirect_uri: process.env.KAKAO_REDIRECT_URL,
          code: code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch((error) => {
        console.error('카카오 토큰 요청 실패:', error.response?.data);
      });
    const accessToken = tokenResponse?.data.access_token;

    // 2. 액세스 토큰으로 사용자 정보 받아오기
    const userResponse = await axios
      .get(KAKAO_USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch((error) => {
        console.error(
          '카카오 사용자 정보 요청 실패:',
          error.response?.data || error.message,
        );
      });

    const kakaoAccount = userResponse?.data.kakao_account;

    let user = await this.userRepository.findOne({
      where: { email: kakaoAccount.email },
    });
    if (!user) {
      user = this.userRepository.create({
        email: kakaoAccount.email,
        provider: 'kakao',
      });
      await this.userRepository.save(user);
      return user.id;
    }
    console.log('카카오 사용자 정보:', userResponse?.data);

    return user;
  }

  // 네이버 로그인
  async naverUser(code: string) {
    console.log('네이버 로그인 받은 코드:', code);

    const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
    const NAVER_USER_INFO_URL = 'https://openapi.naver.com/v1/nid/me';

    const tokenResponse = await axios
      .post(NAVER_TOKEN_URL, null, {
        params: {
          client_id: process.env.NAVER_CLIENT_ID,
          client_secret: process.env.NAVER_CLIENT_SECRET,
          redirect_uri: process.env.NAVER_REDIRECT_URL,
          grant_type: 'authorization_code',
          code: code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch((error) => {
        console.error('네이버 토큰 요청 실패:', error.response?.data);
      });

    const accessToken = tokenResponse?.data.access_token;

    const userResponse = await axios
      .get(NAVER_USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch((error) => {
        console.error('네이버 사용자 정보 요청 실패:', error.response?.data);
      });

    const naverAccount = userResponse?.data.response;
    console.log('네이버 사용자 정보:', naverAccount);

    let user = await this.userRepository.findOne({
      where: { email: naverAccount.email },
    });

    if (!user) {
      user = this.userRepository.create({
        email: naverAccount.email,
        name: naverAccount.name ?? '네이버 사용자',
        phone: naverAccount.mobile ?? '000-0000-0000',
        provider: 'naver',
      });
      await this.userRepository.save(user);
      return user.id;
    }

    return user;
  }

  // 구글 로그인
  async googleUser(code: string) {
    console.log('구글 로그인 요청, 받은 코드:', code);

    const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
    const GOOGLE_USER_INFO_URL =
      'https://www.googleapis.com/oauth2/v2/userinfo';

    const tokenResponse = await axios
      .post(GOOGLE_TOKEN_URL, null, {
        params: {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: process.env.GOOGLE_REDIRECT_URL,
          grant_type: 'authorization_code',
          code: code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
      .catch((error) => {
        console.error('구글 토큰 요청 실패:', error.response?.data);
      });

    const accessToken = tokenResponse?.data.access_token;

    const userResponse = await axios
      .get(GOOGLE_USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .catch((error) => {
        console.error('구글 사용자 정보 요청 실패:', error.response?.data);
      });

    const googleAccount = userResponse?.data;
    console.log('구글 사용자 정보:', googleAccount);

    let user = await this.userRepository.findOne({
      where: { email: googleAccount.email },
    });

    if (!user) {
      user = this.userRepository.create({
        email: googleAccount.email,
        provider: 'google',
      });
      await this.userRepository.save(user);
      return user.id;
    }

    return user;
  }

  // sns JWT 토큰 발급
  async snsToken(user: any) {
    const payload = {
      id: user.id,
      email: user.email,
      provider: user.provider,
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '1h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: '7d',
    });

    // refresh 토큰 db 저장?
    // user.refreshToken = refreshToken;
    // await this.userRepository.save(user);

    return { accessToken, refreshToken };
  }

  // 아이디 찾기
  async findId(name: string, phone: string) {
    const user = await this.userRepository.findOne({ where: { name, phone } });
    if (!user) {
      return { message: '저장된 아이디 없음' };
    }

    return { email: user.email };
  }
  // 비밀번호 찾기
  async findPW(email: string, phone: string) {
    const user = await this.userRepository.findOne({ where: { email, phone } });
    if (!user) {
      return { message: '저장된 비밀번호 없음' };
    }

    return { userID: user.id };
  }

  // 새 비밀번호 업데이트
  async updatePW(userID: number, newPassword: string) {
    const user = await this.userRepository.findOne({ where: { id: userID } });
    if (!user) {
      return { message: '사용자 없음' };
    }

    const hashPW = await bcrypt.hash(newPassword, 10); // 비밀번호 암호화
    user.password = hashPW;
    await this.userRepository.save(user);

    return { message: '새 비밀번호 저장 성공' };
  }

  // 소셜로그인 추가 입력
  async plusInfo(userID: number, name: string, phone: string) {
    const user = await this.userRepository.findOne({ where: { id: userID } });
    if (!user) {
      return { message: '사용자 없음' };
    }

    user.name = name;
    user.phone = phone;

    console.log('사용자정보어떠냐', user);
    await this.userRepository.save(user);

    return { message: '소셜로그인 추가정보 저장 성공' };
  }

  // 이메일, 번호 중복검사
  async duplicateCheck(type: string, valueToCheck: string) {
    const condition =
      type === 'email' ? { email: valueToCheck } : { phone: valueToCheck };
    const user = await this.userRepository.findOne({ where: condition });

    return { message: user ? '중복됨' : '사용 가능', type, exists: !!user };
  }
}
