import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";

import { GetUserFlowService } from "modules/userFlow/services/get";

import {
  CreateDocumentRevisionUserFlowService,
  CreateUserFlowReviewerInterface,
  CreateUserFlowRowInterface,
  CreateUserFlowRowUserInterface,
} from "./create";

@Injectable()
export class CloneDocumentRevisionUserFlowService {
  constructor(
    private createDocumentRevisionUserFlowService: CreateDocumentRevisionUserFlowService,
    @Inject(forwardRef(() => GetUserFlowService)) private getUserFlowService: GetUserFlowService,
  ) {}

  @Transactional()
  async cloneFromRealUserFlowOrFail(realUserFlowId: string) {
    const realUserFlow = await this.getUserFlowService.getUserFlowOrFail(realUserFlowId, {
      loadRows: true,
      loadRowsUsers: true,
      loadRowsUsersUser: true,
      loadReviewer: true,
      loadReviewerUser: true,
    });

    const deadlineWithOptionalIncludeWeekends =
      realUserFlow.deadlineDaysAmount === null
        ? {}
        : {
            deadlineDaysAmount: realUserFlow.deadlineDaysAmount,
            deadlineDaysIncludeWeekends: realUserFlow.deadlineDaysIncludeWeekends,
          };

    const reviewer: CreateUserFlowReviewerInterface | undefined = realUserFlow.reviewer
      ? { userId: realUserFlow.reviewer.user.id }
      : undefined;

    return await this.createDocumentRevisionUserFlowService.createOrFail({
      name: realUserFlow.name,
      reviewer,
      ...deadlineWithOptionalIncludeWeekends,
      rows: realUserFlow.rows.map(
        (row): CreateUserFlowRowInterface => ({
          name: row.name,
          mode: row.mode,
          forbidNextRowsApproving: row.forbidNextRowsApproving,
          users: row.users.map(
            (rowUser): CreateUserFlowRowUserInterface => ({
              id: rowUser.user.id,
              description: rowUser.description,
            }),
          ),
        }),
      ),
    });
  }
}
