import { ServiceError } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "entities/User";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetUserForUpdateService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getUserForUpdating(userId: string) {
    const currentUser = getCurrentUser();
    const user = await this.usersRepository.findOneOrFail({
      where: { id: userId, client: { id: currentUser.clientId }, system: false },
      relations: { client: true, avatar: true },
      withDeleted: true,
    });
    user.calculateAllCans(currentUser);
    if (!user.canUpdate) throw new ServiceError("user", "Вы не можете обновить этого пользователя");
    return user;
  }
}
