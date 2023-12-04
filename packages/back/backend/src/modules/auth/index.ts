import { Global, MiddlewareConsumer, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { config } from "@app/core-config";
import { NestModule } from "@app/back-kit";

import { UserEntity } from "entities/User";
import { UserTokenEntity } from "entities/User/Token";

import { CurrentUserLocalStorageMiddleware } from "./asyncLocalStorage/middleware";
import { AuthController } from "./controller";

import { UserTokenGeneratorService } from "./services/UserTokenGenerator";
import { TokenBackgroundExpirerService } from "./services/TokenBackgroundExpirer";
import { UserTokenService } from "./services/UserToken";
import { UserGetterService } from "./services/UserGetter";

import { EmailAuthStrategy } from "./strategies/email.strategy";
import { JwtAuthStrategy } from "./strategies/jwt.strategy";

@Global()
@Module({
  imports: [
    JwtModule.register({ secret: config._secrets.auth.sign }),
    PassportModule,
    TypeOrmModule.forFeature([UserEntity, UserTokenEntity]),
  ],
  providers: [
    EmailAuthStrategy,
    JwtAuthStrategy,
    UserTokenService,
    UserGetterService,
    TokenBackgroundExpirerService,
    UserTokenGeneratorService,
  ],
  controllers: [AuthController],
  exports: [UserGetterService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserLocalStorageMiddleware).forRoutes("*");
  }
}

export * from "./middleware";
export * from "./asyncLocalStorage";
