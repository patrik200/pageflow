import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ElasticService, ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";

import { UserEntity } from "entities/User";

import { GetUserForUpdateService } from "./get-for-update";

@Injectable()
export class DeleteUserService {
  constructor(
    @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,
    private getUserForUpdateService: GetUserForUpdateService,
    private elasticService: ElasticService,
  ) {}

  @Transactional()
  async deleteUserOrFail(
    userId: string,
    { checkPermissions = true, softDelete = true }: { checkPermissions?: boolean; softDelete?: boolean } = {},
  ) {
    const user = await this.getUserForUpdateService.getUserForUpdating(userId, { checkPermissions });
    if (checkPermissions) {
      if (!user.canDelete) throw new ServiceError("user", "Вы не можете удалить этого пользователя");
    }

    if (softDelete) {
      await this.usersRepository.softDelete({ id: user.id });
    } else {
      await this.usersRepository.delete({ id: user.id });
      await this.elasticService.deleteIndexDocumentOrFail(this.elasticService.getDocumentId("users", user.id));
    }
  }
}
