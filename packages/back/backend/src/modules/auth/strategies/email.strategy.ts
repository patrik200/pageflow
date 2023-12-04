import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy as PassportLocalStrategy } from "passport-local";
import { ServiceError } from "@app/back-kit";
import { isString } from "class-validator";

import { AuthUserEntity, BaseExpressRequest } from "types/express";

import { UserGetterService } from "../services/UserGetter";
import { emptyCurrentUserStorageValue } from "../asyncLocalStorage";

@Injectable()
export class EmailAuthStrategy extends PassportStrategy(PassportLocalStrategy, "email") {
  constructor(private userAuthService: UserGetterService) {
    super({ usernameField: "email", passwordField: "password", passReqToCallback: true });
  }

  async validate(req: BaseExpressRequest, email: string, password: string): Promise<AuthUserEntity> {
    if (!isString(req.body.clientId))
      throw new ServiceError("clientId", "Не передан идентификатор клиента", 400).serializeToHttp();

    const user = await this.userAuthService.getUserIdAndRoleByEmailAndPasswordForClient(
      email,
      password,
      req.body.clientId,
    );
    if (!user) throw new ServiceError("password", "Не верный логин или пароль", 400).serializeToHttp();

    return { ...emptyCurrentUserStorageValue, userId: user.id, role: user.role, clientId: req.body.clientId };
  }
}
