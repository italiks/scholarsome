/**
 * @file Strategy for checking whether a user's access token is still valid
 */

import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { ConfigService } from "@nestjs/config";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * @ignore
   */
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(req: Request) => {
        if (
          req.cookies &&
          "access_token" in req.cookies
        ) {
          return req.cookies.access_token;
        }
        return new UnauthorizedException();
      }]),
      ignoreExpiration: true,
      secretOrKey: configService.get<string>("JWT_SECRET"),
      passReqToCallback: true
    });
  }

  async validate(req, payload) {
    try {
      jwt.verify(req.cookies.access_token, this.configService.get<string>("JWT_SECRET"));
    } catch (e) {
      throw new UnauthorizedException("Token expired");
    }

    if (!payload) {
      throw new UnauthorizedException();
    }

    return { email: payload.email };
  }
}
