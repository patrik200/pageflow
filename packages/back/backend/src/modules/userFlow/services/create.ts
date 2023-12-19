import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserFlowMode } from "@app/shared-enums";
import { Transactional } from "typeorm-transactional";
import { ServiceError } from "@app/back-kit";

import { UserFlowEntity } from "entities/UserFlow";
import { UserFlowReviewerEntity } from "entities/UserFlow/Reviewer";
import { UserFlowRowEntity } from "entities/UserFlow/Row";
import { UserFlowRowUserEntity } from "entities/UserFlow/Row/User";

import { getCurrentUser } from "modules/auth";
import { GetUserService } from "modules/users";

export interface CreateUserFlowRowUserInterface {
  id: string;
  description: string;
}

export interface CreateUserFlowRowInterface {
  name: string;
  forbidNextRowsApproving: boolean;
  mode: UserFlowMode;
  users: CreateUserFlowRowUserInterface[];
}

export interface CreateOrUpdateUserFlowInterface {
  name: string;
  deadlineDaysAmount?: number | null;
  deadlineDaysIncludeWeekends: boolean;
  reviewerId?: string | null;
  rows: CreateUserFlowRowInterface[];
}

@Injectable()
export class CreateUserFlowService {
  constructor(
    @InjectRepository(UserFlowEntity) private userFlowRepository: Repository<UserFlowEntity>,
    @InjectRepository(UserFlowReviewerEntity) private userFlowReviewerRepository: Repository<UserFlowReviewerEntity>,
    @InjectRepository(UserFlowRowEntity) private userFlowRowRepository: Repository<UserFlowRowEntity>,
    @InjectRepository(UserFlowRowUserEntity) private userFlowRowUserRepository: Repository<UserFlowRowUserEntity>,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
  ) {}

  @Transactional()
  async unsafeCreateUserFlowRow(userFlowId: string, index: number, row: CreateUserFlowRowInterface) {
    const savedRow = await this.userFlowRowRepository.save({
      sort: index,
      name: row.name,
      forbidNextRowsApproving: row.forbidNextRowsApproving,
      mode: row.mode,
      userFlow: { id: userFlowId },
    });

    await Promise.all(
      row.users.map(async ({ id, description }) => {
        const user = await this.getUserService.getUserOrFail(id, "id");
        return await this.userFlowRowUserRepository.save({
          description,
          user: { id: user.id },
          row: { id: savedRow.id },
        });
      }),
    );

    return savedRow;
  }

  @Transactional()
  async createOrFail(options: CreateOrUpdateUserFlowInterface) {
    const currentUser = getCurrentUser();
    if (
      await this.userFlowRepository.findOne({
        where: { name: options.name, client: { id: currentUser.clientId } },
      })
    )
      throw new ServiceError("name", "Маршрут с таким именем уже существует");

    const userFlow = await this.userFlowRepository.save({
      client: { id: currentUser.clientId },
      author: { id: currentUser.userId },
      name: options.name,
      deadlineDaysAmount: options.deadlineDaysAmount,
      deadlineDaysIncludeWeekends: options.deadlineDaysIncludeWeekends,
    });

    if (options.reviewerId) {
      const reviewerUser = await this.getUserService.getUserOrFail(options.reviewerId, "id");
      const reviewer = await this.userFlowReviewerRepository.save({
        userFlow,
        user: reviewerUser,
      });
      await this.userFlowRepository.update(userFlow.id, {
        reviewer: { id: reviewer.id },
      });
    }

    await Promise.all(
      options.rows.map(async (row, index) => await this.unsafeCreateUserFlowRow(userFlow.id, index, row)),
    );

    return userFlow.id;
  }
}
