import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export  class AccessTokenjwtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
    constructor(private configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_ACCESS_TOKEN'),
        });
    }

    async validate(payload:any) {                
        return {
            sub: payload.sub,
            info: payload.info,
            
        }
    }
}