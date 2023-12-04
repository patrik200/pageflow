import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { EditDocumentRevisionStatusesService } from "./edit-status";
import { GetDocumentRevisionForChangeStatusService } from "./get-for-change";

@Injectable()
export class RequestReviewDocumentRevisionStatusesService {
  constructor(
    private getDocumentRevisionStatusesForChangeService: GetDocumentRevisionForChangeStatusService,
    private editDocumentRevisionStatusesService: EditDocumentRevisionStatusesService,
  ) {}

  @Transactional()
  async requestRevisionReviewOrFail(revisionId: string) {
    const revision = await this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(
      revisionId,
      "editor",
    );

    if (!revision.canMoveToReviewStatus)
      throw new ServiceError("user", "Вы не можете запросить проверку для этой ревизии");

    await this.editDocumentRevisionStatusesService.unsafeUpdateRevisionStatusOrFail(revision, {
      status: DocumentRevisionStatus.REVIEW,
    });
  }
}
