import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    try {
      return super.canActivate(context);
    } catch (err) {
      return false; // 인증 실패 시 false 반환
    }
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      return null; // 유저가 없으면 null 반환 (401 발생 방지)
    }
    return user;
  }
}
