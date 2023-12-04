import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { EditDocumentRevisionStatusesService } from "./edit-status";
import { GetDocumentRevisionForChangeStatusService } from "./get-for-change";

@Injectable()
export class ActiveDocumentRevisionStatusesService {
  constructor(
    private getDocumentRevisionStatusesForChangeService: GetDocumentRevisionForChangeStatusService,
    private editDocumentRevisionStatusesService: EditDocumentRevisionStatusesService,
  ) {}

  @Transactional()
  async activeRevisionOrFail(revisionId: string) {
    const revision = await this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(
      revisionId,
      "editor",
    );

    if (!revision.canMoveToInitialStatusForRestore)
      throw new ServiceError("user", "Вы не можете разархивировать эту ревизию");

    await this.editDocumentRevisionStatusesService.unsafeUpdateRevisionStatusOrFail(revision, {
      status: DocumentRevisionStatus.INITIAL,
      returnMessage: null,
      returnCodeKey: null,
    });
  }
}
