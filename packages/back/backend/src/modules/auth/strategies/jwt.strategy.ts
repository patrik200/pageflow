import { ExtractJwt, Strategy as PassportJwtStrategy } from "passport-jwt";
import { config } from "@app/core-config";
import { Request } from "express";
import cookieLib from "cookie";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Socket } from "socket.io";
import { ServiceError } from "@app/back-kit";

import { GetSubscriptionService } from "modules/subscription/services/get";
import { GetClientsService } from "modules/clients/services/client/get";

import { AuthUserEntity } from "types/express";

import { UserGetterService } from "../services/UserGetter";

@Injectable()
export class JwtAuthStrategy extends PassportStrategy(PassportJwtStrategy, "jwt") {
  constructor(
    private userAuthService: UserGetterService,
    @Inject(forwardRef(() => GetSubscriptionService)) private getSubscriptionService: GetSubscriptionService,
    @Inject(forwardRef(() => GetClientsService)) private getClientsService: GetClientsService,
  ) {
    super({
      ignoreExpiration: true,
      secretOrKey: config._secrets.auth.sign,
      passReqToCallback: false,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request | Socket) => {
          if ("handshake" in request) {
            if (!request.handshake.headers.cookie) return false;
            const cookies = cookieLib.parse(request.handshake.headers.cookie);
            return cookies?.token || null;
          }
          return request.cookies.token || null;
        },
      ]),
    });
  }

  async validate(accessToken: string): Promise<AuthUserEntity> {
    const userInfo = await this.userAuthService.getUserInfoByAccessTokenOrNull(accessToken);
    if (!userInfo) throw new ServiceError("token", "Токен доступа не действителен", 400).serializeToHttp();

    const [validatedUserInfo, subscription, client] = await Promise.all([
      userInfo.validateTokenPromise,
      this.getSubscriptionService.unsafeGetSubscriptionByClientIdOrFail(userInfo.unsafeUserInfo.clientId),
      this.getClientsService.getClientByIdOrFail(userInfo.unsafeUserInfo.clientId),
    ]);

    if (!validatedUserInfo) throw new ServiceError("token", "Токен доступа не действителен", 400).serializeToHttp();

    return {
      ...validatedUserInfo,
      clientSubscriptionActive: subscription.active,
      clientReadOnlyMode: client.readOnlyMode,
    };
  }
}
