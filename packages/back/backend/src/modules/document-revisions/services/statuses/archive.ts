import { Injectable } from "@nestjs/common";
import { Transactional } from "typeorm-transactional";
import { DocumentRevisionStatus } from "@app/shared-enums";

import { ResetToInitialDocumentRevisionStatusesService } from "./reset-to-initial";

@Injectable()
export class ArchiveDocumentRevisionStatusesService {
  constructor(private resetToInitialDocumentRevisionStatusesService: ResetToInitialDocumentRevisionStatusesService) {}

  @Transactional()
  async archiveRevisionOrFail(revisionId: string) {
    await this.resetToInitialDocumentRevisionStatusesService.resetToInitialRevisionOrFail(
      revisionId,
      DocumentRevisionStatus.ARCHIVE,
    );
  }
}
