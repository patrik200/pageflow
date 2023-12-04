import { getCurrentUser } from "modules/auth";

export class DocumentRevisionDeleted {
  static eventName = "document.revision.deleted";

  constructor(public revisionId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
