import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-naver";
import { AuthService } from "../auth.service";

@Injectable()
export class NaverStrategy extends PassportStrategy(Strategy, 'naver'){
    constructor(private readonly authService: AuthService){
        super({
            clientID: process.env.NAVER_CLIENT_ID as string,
            clientSecret: process.env.NAVER_CLIENT_SECRET as string,
            callbackURL: process.env.NAVER_REDIRECT_URL as string,
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void){
        try{
            const jsonData = profile._json as any; 
            const response = jsonData.response ?? jsonData;
            const user = {
                email: response.email,
                name: response.name ?? "네이버 사용자",
                phone: response.mobile ?? "000-0000-0000",
                provider: 'naver'
            };
            done(null, user);
        } catch (err){
            done(err)
        }
    }
}
