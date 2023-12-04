import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserFlowMode } from "@app/shared-enums";
import { Transactional } from "typeorm-transactional";

import { DocumentRevisionResponsibleUserFlowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving";
import { DocumentRevisionResponsibleUserFlowRowEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row";
import { DocumentRevisionResponsibleUserFlowRowUserEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Row/User";
import { DocumentRevisionResponsibleUserFlowReviewerEntity } from "entities/Document/Document/Revision/Approving/UserFlowApproving/Reviewer";

import { getCurrentUser } from "modules/auth";
import { GetUserService } from "modules/users";

export interface CreateUserFlowReviewerInterface {
  userId: string;
}

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

export type CreateUserFlowInterface = {
  name: string;
  reviewer: CreateUserFlowReviewerInterface | undefined;
  rows: CreateUserFlowRowInterface[];
} & (
  | { deadlineDaysAmount?: null; deadlineDaysIncludeWeekends?: undefined }
  | { deadlineDaysAmount: number; deadlineDaysIncludeWeekends: boolean }
);

@Injectable()
export class CreateDocumentRevisionUserFlowService {
  constructor(
    @InjectRepository(DocumentRevisionResponsibleUserFlowEntity)
    private revisionUserFlowRepository: Repository<DocumentRevisionResponsibleUserFlowEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowEntity)
    private revisionUserFlowRowRepository: Repository<DocumentRevisionResponsibleUserFlowRowEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowRowUserEntity)
    private revisionUserFlowRowUserRepository: Repository<DocumentRevisionResponsibleUserFlowRowUserEntity>,
    @InjectRepository(DocumentRevisionResponsibleUserFlowReviewerEntity)
    private revisionUserFlowReviewerRepository: Repository<DocumentRevisionResponsibleUserFlowReviewerEntity>,
    @Inject(forwardRef(() => GetUserService)) private getUserService: GetUserService,
  ) {}

  @Transactional()
  private async unsafeCreateUserFlowRow(userFlowId: string, index: number, row: CreateUserFlowRowInterface) {
    const savedRow = await this.revisionUserFlowRowRepository.save({
      index,
      name: row.name,
      forbidNextRowsApproving: row.forbidNextRowsApproving,
      mode: row.mode,
      userFlow: { id: userFlowId },
    });

    await Promise.all(
      row.users.map(async ({ id, description }, index) => {
        const user = await this.getUserService.getUserOrFail(id, "id");
        await this.revisionUserFlowRowUserRepository.save({
          index,
          description,
          user: { id: user.id },
          row: { id: savedRow.id },
        });
      }),
    );

    return savedRow;
  }

  @Transactional()
  private async unsafeCreateReviewer(userFlowId: string, reviewer: CreateUserFlowReviewerInterface) {
    return await this.revisionUserFlowReviewerRepository.save({
      approved: false,
      user: { id: reviewer.userId },
      userFlow: { id: userFlowId },
    });
  }

  @Transactional()
  async createOrFail(options: CreateUserFlowInterface) {
    const userFlow = await this.revisionUserFlowRepository.save({
      name: options.name,
      deadlineDaysAmount: options.deadlineDaysAmount,
      deadlineDaysIncludeWeekends: options.deadlineDaysIncludeWeekends,
      client: { id: getCurrentUser().clientId },
    });

    if (options.reviewer) {
      const reviewer = await this.unsafeCreateReviewer(userFlow.id, options.reviewer);
      await this.revisionUserFlowRepository.update(userFlow.id, {
        reviewer: { id: reviewer.id },
      });
    }

    await Promise.all(
      options.rows.map(async (row, index) => await this.unsafeCreateUserFlowRow(userFlow.id, index, row)),
    );

    return userFlow.id;
  }
}
