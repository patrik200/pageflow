import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserTokenEntity } from "entities/User/Token";

import { UserAccessTokenPayload, UserTokenGeneratorService } from "./UserTokenGenerator";

interface SaveJwtTokenOptions {
  id?: string;
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresAt: Date;
  refreshTokenExpiresAt: Date;
}

@Injectable()
export class UserTokenService {
  constructor(
    @InjectRepository(UserTokenEntity) private userTokensRepository: Repository<UserTokenEntity>,
    private userTokenGeneratorService: UserTokenGeneratorService,
  ) {}

  async generateJwtTokens(userId: string, clientId: string) {
    return this.userTokenGeneratorService.generateJwtTokens(userId, clientId);
  }

  async saveJwtToken(userId: string, clientId: string, options: SaveJwtTokenOptions) {
    await this.userTokensRepository.save({ ...options, user: { id: userId }, client: { id: clientId } });
  }

  private async validateUserAccessTokenPayload(accessToken: string, userInfo: UserAccessTokenPayload) {
    try {
      const entity = await this.userTokensRepository.findOneOrFail({
        where: { accessToken },
        relations: { user: true, client: true },
      });
      if (entity.user.id !== userInfo.userId || entity.client.id !== userInfo.clientId) {
        await this.userTokensRepository.delete(entity.id);
        return null;
      }
      return { userId: entity.user.id, clientId: entity.client.id, role: entity.user.role };
    } catch (e) {
      return null;
    }
  }

  async getUserInfoFromAccessToken(accessToken: string) {
    const userInfo = await this.userTokenGeneratorService.getUserInfoFromAccessToken(accessToken);
    if (!userInfo) return null;
    return {
      unsafeUserInfo: userInfo,
      validateTokenPromise: this.validateUserAccessTokenPayload(accessToken, userInfo),
    };
  }

  async refreshJwtToken(oldRefreshTokenRaw: string) {
    const oldRefreshToken = await this.userTokenGeneratorService.verifyRefreshToken(oldRefreshTokenRaw);
    if (!oldRefreshToken) throw new ServiceError("token", "Не корректный токен", 400);

    const tokenEntity = await this.userTokensRepository.findOneOrFail({
      where: { refreshToken: oldRefreshToken },
      relations: { user: true, client: true },
    });
    const { accessToken, accessJwtToken, accessTokenExpiresAt, refreshToken, refreshJwtToken, refreshTokenExpiresAt } =
      await this.generateJwtTokens(tokenEntity.user.id, tokenEntity.client.id);

    await this.saveJwtToken(tokenEntity.user.id, tokenEntity.client.id, {
      id: tokenEntity.id,
      accessToken: accessToken,
      accessTokenExpiresAt,
      refreshToken: refreshToken,
      refreshTokenExpiresAt,
    });

    return {
      accessToken,
      accessJwtToken,
      accessTokenExpiresAt,
      refreshToken,
      refreshJwtToken,
      refreshTokenExpiresAt,
    };
  }
}
