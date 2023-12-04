import { DocumentEntity } from "entities/Document/Document";

import { getCurrentUser } from "modules/auth";

export class DocumentUpdated {
  static eventName = "document.updated";

  constructor(
    public documentId: string,
    public oldDocument: DocumentEntity,
    public triggerUserId = getCurrentUser()?.userId,
  ) {}
}
