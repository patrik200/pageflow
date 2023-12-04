import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";

import { UserEntity } from "entities/User";

import { GetUserForUpdateService } from "./get-for-update";

@Injectable()
export class RestoreUserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private getUserForUpdateService: GetUserForUpdateService,
  ) {}

  @Transactional()
  async restoreUserOrFail(userId: string) {
    const user = await this.getUserForUpdateService.getUserForUpdating(userId);
    if (!user.canRestore) throw new ServiceError("user", "Вы не можете восстановить этого пользователя");
    await this.usersRepository.update(userId, { deletedAt: undefined });
  }
}
