import { Injectable } from "@nestjs/common";
import { DocumentRevisionStatus, DocumentStatus } from "@app/shared-enums";

@Injectable()
export class GetDocumentRevisionInitialStatusService {
  getInitialStatus(documentStatus: DocumentStatus) {
    return documentStatus === DocumentStatus.ACTIVE
      ? DocumentRevisionStatus.INITIAL
      : DocumentRevisionStatus.ARCHIVED_AUTOMATICALLY_RESTORE_INITIAL;
  }
}
