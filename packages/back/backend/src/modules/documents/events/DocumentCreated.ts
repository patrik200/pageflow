import { getCurrentUser } from "modules/auth";

export class DocumentCreated {
  static eventName = "document.created";

  constructor(public documentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
