import { getCurrentUser } from "modules/auth";

export class CorrespondenceDeleted {
  static eventName = "correspondence.deleted";

  constructor(public correspondenceId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
