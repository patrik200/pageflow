import { getCurrentUser } from "modules/auth";

export class DocumentRevisionCreated {
  static eventName = "document.revision.created";

  constructor(public revisionId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
