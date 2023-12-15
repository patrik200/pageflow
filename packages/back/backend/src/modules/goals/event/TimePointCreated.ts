import { TimepointEntity } from "entities/Timepoint";

import { getCurrentUser } from "modules/auth";

export class TimepointCreated {
  static eventName = "timepoint.created";

  constructor(public timePoint: TimepointEntity, public triggerUserId = getCurrentUser()?.userId) {}
}
