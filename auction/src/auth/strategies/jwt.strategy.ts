import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        @InjectRepository(Users)
        private userRepository: Repository<Users>,
    ){
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    console.log("📌 요청된 쿠키:", request.headers.cookie);
                    console.log("쿠키에서 토큰 추출:", request?.cookies?.access_token);

                    return request?.cookies?.access_token; // 헤더 Bearer Token 추출
                },
              ]),
              ignoreExpiration: false,
              secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
        });
    }

    async validate(payload: { id: number }) {
        console.log("📌 validate 실행됨!"); // ✅ validate가 실행되는지 확인
        console.log("토큰에서 추출한 ID:", payload.id); // ✅ 토큰이 유효한지 확인
        const user = await this.userRepository.findOne({ where: { id: payload.id } });
        if (!user) {
            console.log("유저 정보 없음"); // ✅ 유저를 못 찾는 경우 로그 추가

            throw new UnauthorizedException('유효하지 않은 토큰임');
        }
        console.log("유저 인증 성공:", user); // ✅ 유저 인증 성공 로그

        return user;
    }
}