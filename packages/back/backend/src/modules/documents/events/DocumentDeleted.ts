import { getCurrentUser } from "modules/auth";

export class DocumentDeleted {
  static eventName = "document.deleted";

  constructor(public documentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
