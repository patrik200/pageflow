import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { config } from "@app/core-config";
import { CryptoService } from "@app/back-kit";
import { DateTime } from "luxon";

export interface UserTokenGeneratorTokens {
  accessToken: string;
  accessJwtToken: string;
  accessTokenExpiresAt: Date;
  refreshToken: string;
  refreshJwtToken: string;
  refreshTokenExpiresAt: Date;
}

export interface UserAccessTokenPayload {
  userId: string;
  clientId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class UserTokenGeneratorService {
  constructor(private cryptoService: CryptoService, private jwtService: JwtService) {}

  private generateToken(value: { userId: string; clientId?: string }, options: { expiration: Date }) {
    const payload = JSON.stringify({ ...value, iat: Date.now(), exp: +options.expiration });
    return this.cryptoService.sign(config._secrets.auth.sign, Buffer.from(payload).toString("base64"));
  }

  async generateJwtTokens(userId: string, clientId: string): Promise<UserTokenGeneratorTokens> {
    const accessToken = this.generateToken(
      { userId, clientId },
      { expiration: new Date(Date.now() + config.auth.accessTokenExpiresInMS) },
    );
    const refreshToken = this.generateToken(
      { userId },
      { expiration: new Date(Date.now() + config.auth.refreshTokenExpiresInMS) },
    );

    const [accessJwtToken, refreshJwtToken] = await Promise.all([
      this.jwtService.signAsync(accessToken),
      this.jwtService.signAsync(refreshToken),
    ]);

    const now = DateTime.now();
    return {
      accessToken,
      accessJwtToken,
      accessTokenExpiresAt: now.plus({ millisecond: config.auth.accessTokenExpiresInMS }).toJSDate(),
      refreshToken,
      refreshJwtToken,
      refreshTokenExpiresAt: now.plus({ millisecond: config.auth.refreshTokenExpiresInMS }).toJSDate(),
    };
  }

  async getUserInfoFromAccessToken(accessToken: string) {
    try {
      const payload = this.cryptoService.unsign(config._secrets.auth.sign, accessToken);
      if (payload === false) return null;
      return JSON.parse(Buffer.from(payload, "base64").toString("utf-8")) as UserAccessTokenPayload;
    } catch (e) {
      return null;
    }
  }

  async verifyRefreshToken(refreshToken: string) {
    try {
      return (await this.jwtService.verifyAsync<any>(refreshToken)) as string;
    } catch (e) {
      return null;
    }
  }
}
