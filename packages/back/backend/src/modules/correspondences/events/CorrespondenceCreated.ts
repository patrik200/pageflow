import { getCurrentUser } from "modules/auth";

export class CorrespondenceCreated {
  static eventName = "correspondence.created";

  constructor(public correspondenceId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
