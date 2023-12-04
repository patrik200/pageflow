import { DocumentRevisionEntity } from "entities/Document/Document/Revision";

import { getCurrentUser } from "modules/auth";

export class DocumentRevisionUpdated {
  static eventName = "document.revision.updated";

  constructor(
    public revisionId: string,
    public oldRevision: DocumentRevisionEntity,
    public triggerUserId = getCurrentUser()?.userId,
  ) {}
}
