import { Injectable } from "@nestjs/common";
import { ServiceError } from "@app/back-kit";
import { Transactional } from "typeorm-transactional";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { EditDocumentRevisionStatusesService } from "./edit-status";
import { GetDocumentRevisionForChangeStatusService } from "./get-for-change";

@Injectable()
export class RestoreDocumentRevisionStatusesService {
  constructor(
    private getDocumentRevisionStatusesForChangeService: GetDocumentRevisionForChangeStatusService,
    private editDocumentRevisionStatusesService: EditDocumentRevisionStatusesService,
  ) {}

  @Transactional()
  async restoreRevisionOrFail(revisionId: string) {
    const revision = await this.getDocumentRevisionStatusesForChangeService.getRevisionForChangeStatus(
      revisionId,
      "editor",
    );

    if (!revision.canMoveToInitialStatusForFromRevoked)
      throw new ServiceError("user", "Вы не можете восстановить эту ревизию");

    await this.editDocumentRevisionStatusesService.unsafeUpdateRevisionStatusOrFail(revision, {
      status: DocumentRevisionStatus.INITIAL,
    });
  }
}
