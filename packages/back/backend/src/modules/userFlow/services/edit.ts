import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";
import { ServiceError, TypeormUpdateEntity } from "@app/back-kit";

import { UserFlowEntity } from "entities/UserFlow";
import { UserFlowReviewerEntity } from "entities/UserFlow/Reviewer";
import { UserFlowRowEntity } from "entities/UserFlow/Row";

import { getCurrentUser } from "modules/auth";
import { GetUserService } from "modules/users";

import { CreateOrUpdateUserFlowInterface, CreateUserFlowService } from "./create";

@Injectable()
export class EditUserFlowService {
  constructor(
    @InjectRepository(UserFlowEntity) private userFlowRepository: Repository<UserFlowEntity>,
    @InjectRepository(UserFlowReviewerEntity) private userFlowReviewerRepository: Repository<UserFlowReviewerEntity>,
    @InjectRepository(UserFlowRowEntity) private userFlowRowRepository: Repository<UserFlowRowEntity>,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
    private createUserFlowService: CreateUserFlowService,
  ) {}

  @Transactional()
  async updateOrFail(id: string, options: CreateOrUpdateUserFlowInterface) {
    const currentUser = getCurrentUser();
    const userFlow = await this.userFlowRepository.findOneOrFail({
      where: { client: { id: currentUser.clientId }, id },
      relations: { rows: true, author: true, reviewer: true },
    });

    userFlow.calculateAllCans(currentUser);
    if (!userFlow.canUpdate) throw new ServiceError("user", "Вы не можете изменить этот маршрут документа");

    await Promise.all(userFlow.rows.map((row) => this.userFlowRowRepository.delete(row.id)));

    const updateOptions: TypeormUpdateEntity<UserFlowEntity> = {
      name: options.name,
      deadlineDaysAmount: options.deadlineDaysAmount,
      deadlineDaysIncludeWeekends: options.deadlineDaysIncludeWeekends,
    };

    if (options.reviewerId !== undefined) {
      if (userFlow.reviewer) await this.userFlowReviewerRepository.delete(userFlow.reviewer.id);
      if (options.reviewerId === null) {
        updateOptions.reviewer = null;
      } else {
        const reviewerUser = await this.getUserService.getUserOrFail(options.reviewerId, "id");
        updateOptions.reviewer = await this.userFlowReviewerRepository.save({
          userFlow,
          user: reviewerUser,
        });
      }
    }

    await this.userFlowRepository.update(userFlow.id, updateOptions);

    await Promise.all(
      options.rows.map((row, index) => this.createUserFlowService.unsafeCreateUserFlowRow(userFlow.id, index, row)),
    );
  }
}
