import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOptionsWhere, Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { ServiceError } from "@app/back-kit";

import { UserFlowEntity } from "entities/UserFlow";
import { UserFlowReviewerEntity } from "entities/UserFlow/Reviewer";

import { getCurrentUser } from "modules/auth";

@Injectable()
export class DeleteUserFlowService {
  constructor(
    @InjectRepository(UserFlowEntity) private userFlowRepository: Repository<UserFlowEntity>,
    @InjectRepository(UserFlowReviewerEntity) private userFlowReviewerRepository: Repository<UserFlowReviewerEntity>,
  ) {}

  @Transactional()
  async deleteUserFlowOrFail(id: string, { checkPermissions = true }: { checkPermissions?: boolean } = {}) {
    const currentUser = getCurrentUser();

    const findOptionsWhere: FindOptionsWhere<UserFlowEntity> = { id };
    findOptionsWhere.client = { id: currentUser.clientId };

    const userFlow = await this.userFlowRepository.findOneOrFail({
      where: findOptionsWhere,
      relations: { author: true, reviewer: true },
    });

    if (checkPermissions) {
      userFlow.calculateAllCans(currentUser);
      if (!userFlow.canUpdate) throw new ServiceError("user", "Вы не можете удалить этот маршрут документа");
    }

    if (userFlow.reviewer) {
      await this.userFlowReviewerRepository.delete(userFlow.reviewer.id);
    }

    await this.userFlowRepository.delete(userFlow.id);
  }
}
