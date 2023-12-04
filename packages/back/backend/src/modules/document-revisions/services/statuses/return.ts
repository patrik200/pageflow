import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { EditDocumentRevisionStatusesService } from "./edit-status";
import { GetDocumentRevisionForChangeStatusService } from "./get-for-change";

interface ReturnRevisionData {
  returnCodeKey: string;
  comment?: string;
}

@Injectable()
export class ReturnDocumentRevisionStatusesService {
  constructor(
    private getDocumentRevisionStatusesForChangeService: GetDocumentRevisionForChangeStatusService,
    private editDocumentRevisionStatusesService: EditDocumentRevisionStatusesService,
  ) {}

  @Transactional()
  async returnRevisionOrFail(revisionId: string, data: ReturnRevisionData) {
    const revision = await this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(
      revisionId,
      "editor",
    );

    if (!revision.canMoveToReturnStatus) throw new ServiceError("user", "Вы не можете вернуть эту ревизию");

    await this.editDocumentRevisionStatusesService.unsafeUpdateRevisionStatusOrFail(revision, {
      status: DocumentRevisionStatus.RETURNED,
      returnMessage: data.comment,
      returnCodeKey: data.returnCodeKey,
    });
  }
}
