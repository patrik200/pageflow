import { getCurrentUser } from "modules/auth";

export class CorrespondenceRevisionDeleted {
  static eventName = "correspondence.revision.deleted";

  constructor(public revisionId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
