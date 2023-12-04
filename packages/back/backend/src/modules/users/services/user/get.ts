import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityNotFoundError, FindOptionsWhere, Repository } from "typeorm";

import { UserEntity } from "entities/User";

import { getCurrentUser } from "modules/auth";

interface UserSelectOptions {
  loadAvatar?: boolean;
  loadClient?: boolean;
  unsafe?: boolean;
  withDeleted?: boolean;
}

@Injectable()
export class GetUserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async getUserOrFail(key: string, keyMode: "id" | "email", options?: UserSelectOptions) {
    const user = await this.getUser(key, keyMode, options);
    if (!user) throw new EntityNotFoundError(UserEntity, key);
    return user;
  }

  async getUser(
    key: string,
    keyMode: "id" | "email",
    { unsafe = false, withDeleted, ...options }: UserSelectOptions & { withDeleted?: boolean } = {},
  ) {
    const currentUser = unsafe ? undefined : getCurrentUser();
    const findOptions: FindOptionsWhere<UserEntity> = { [keyMode === "id" ? "id" : "email"]: key, system: false };
    if (currentUser) findOptions.client = { id: currentUser.clientId };

    const user = await this.usersRepository.findOne({
      where: findOptions,
      relations: {
        avatar: options.loadAvatar,
        client: options.loadClient,
      },
      withDeleted,
    });

    if (currentUser) user?.calculateAllCans(currentUser);

    return user;
  }
}
