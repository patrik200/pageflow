import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { EditDocumentRevisionStatusesService } from "./edit-status";
import { GetDocumentRevisionForChangeStatusService } from "./get-for-change";

@Injectable()
export class CancelReviewDocumentRevisionStatusesService {
  constructor(
    private getDocumentRevisionForChangeStatusService: GetDocumentRevisionForChangeStatusService,
    private editDocumentRevisionStatusesService: EditDocumentRevisionStatusesService,
  ) {}

  @Transactional()
  async cancelRevisionReviewOrFail(revisionId: string) {
    const revision = await this.getDocumentRevisionForChangeStatusService.getRevisionForChangeStatus(
      revisionId,
      "editor",
    );

    if (!revision.canMoveToInitialStatusForCancelReview)
      throw new ServiceError("user", "Вы не можете отменить проверку для этой ревизии");

    await this.editDocumentRevisionStatusesService.unsafeUpdateRevisionStatusOrFail(revision, {
      status: DocumentRevisionStatus.INITIAL,
    });
  }
}
