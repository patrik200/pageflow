import { ServiceError } from "@app/back-kit";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";

import { UserEntity } from "entities/User";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class GetUserForUpdateService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getUserForUpdating(userId: string, { checkPermissions = true }: { checkPermissions?: boolean } = {}) {
    const findOptionsWhere: FindOptionsWhere<UserEntity> = { id: userId };
    const currentUser = getCurrentUser();
    findOptionsWhere.client = { id: currentUser.clientId };

    const user = await this.usersRepository.findOneOrFail({
      where: findOptionsWhere,
      relations: { client: true, avatar: true },
      withDeleted: true,
    });

    if (checkPermissions) {
      user.calculateAllCans(currentUser);
      if (!user.canUpdate) throw new ServiceError("user", "Вы не можете обновить этого пользователя");
    }

    return user;
  }
}
