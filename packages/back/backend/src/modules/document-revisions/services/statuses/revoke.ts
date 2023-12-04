import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { ResetToInitialDocumentRevisionStatusesService } from "./reset-to-initial";

@Injectable()
export class RevokeDocumentRevisionStatusesService {
  constructor(private resetToInitialDocumentRevisionStatusesService: ResetToInitialDocumentRevisionStatusesService) {}

  @Transactional()
  async revokeRevisionOrFail(revisionId: string) {
    await this.resetToInitialDocumentRevisionStatusesService.resetToInitialRevisionOrFail(
      revisionId,
      DocumentRevisionStatus.REVOKED,
    );
  }
}
