import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { Request } from "express";

@Injectable()
export  class RefreshTokenjwtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get('JWT_REFRESH_TOKEN'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload:any) {        
        const refreshToken = req.get('authorization').replace('Bearer', '').trim();
        return {
            ...payload,
            refreshToken,
        }
    }
}