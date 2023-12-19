import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CryptoService } from "@app/back-kit";

import { UserEntity } from "entities/User";

import { UserTokenService } from "./UserToken";

@Injectable()
export class UserGetterService {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private userTokenService: UserTokenService,
    private cryptoService: CryptoService,
  ) {}

  async getUserInfoByAccessTokenOrNull(accessToken: string) {
    return await this.userTokenService.getUserInfoFromAccessToken(accessToken);
  }

  async getUserIdAndRoleByEmailAndPasswordForClient(email: string, password: string, clientId: string) {
    if (email === "") return null;
    const user = await this.usersRepository.findOne({
      where: { email, client: { id: clientId } },
      select: ["id", "role", "email", "passwordHash"],
    });
    if (!user) return null;

    const passwordIsValid = this.cryptoService.compareTextWithHash(password, user.passwordHash);
    if (!passwordIsValid) return null;

    return { id: user.id, role: user.role };
  }
}
