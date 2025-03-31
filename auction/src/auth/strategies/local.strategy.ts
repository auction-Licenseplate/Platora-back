import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email', passwordField: 'password' }); // 요청 데이터 필드 지정
  }

  // 함수명 validate로 작성해야하는 조건 있음
  async validate(email: string, password: string): Promise<any> {
    const user = await this.authService.localLogin(email, password);
    if (!user.token) {
      throw new UnauthorizedException('이메일 또는 비밀번호가 잘못됨.');
    }
    return user;
  }
}
