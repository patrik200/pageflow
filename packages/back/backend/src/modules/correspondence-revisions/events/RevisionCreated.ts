import { getCurrentUser } from "modules/auth";

export class CorrespondenceRevisionCreated {
  static eventName = "correspondence.revision.created";

  constructor(public revisionId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
