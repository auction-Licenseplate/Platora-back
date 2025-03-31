import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { AuthService } from "../auth.service";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google'){
    constructor(private readonly authService: AuthService) {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            callbackURL: process.env.GOOGLE_REDIRECT_URL as string,
            scope: ["email", "profile"],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void){
        console.log("Google profile이란:", profile);
        try{
            if (!profile.emails || profile.emails.length === 0) {
                return done(new Error("이메일 정보 없음"), null);
            }

            const { emails } = profile;
            const user = {
                email: emails[0].value,
                provider: "google"
            };
            done(null, user);
        } catch(err){
            done(err);
        }
    }
}