import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.fromExtractors([
      //   (request) => {
      //     console.log(request, '프론트요청')
      //     console.log("쿠키에서 토큰 추출:", request?.cookies);
      //     const token = request?.cookies?.accessToken; // 헤더 Bearer Token 추출
      //     console.log(token, '토큰자름')
      //     return token;
      //   },
      // ]),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
    });
  }

  async validate(payload: { id: number }) {
    console.log(payload.id, '페이로드')
    const user = await this.userRepository.findOne({
      where: { id: payload.id },
    });
    if (!user) {
      console.log('유저 정보 없음');
      throw new UnauthorizedException('유효하지 않은 토큰임');
    }
    console.log(user, '사용자임')
    return user;
  }
}
