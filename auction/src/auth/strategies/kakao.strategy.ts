import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";
import { AuthService } from "../auth.service";
import { Profile } from "passport-kakao";

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao'){
    constructor(private readonly authService: AuthService){
        super({
            clientID: process.env.KAKAO_CLIENT_ID as string,
            clientSecret: process.env.KAKAO_CLIENT_SECRET as string,
            callbackURL: process.env.KAKAO_REDIRECT_URL as string,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void){
        console.log('accessToken', accessToken);
        console.log('refreshToken', refreshToken);
        console.log("Kakao profile이란:", profile);
        try{
            const {_json} = profile
            const user = {
                email: _json.kakao_account.email,
                provider: 'kakao'
            }
            done(null, user);
        } catch (err) {
            done(err)
        }
    }
}