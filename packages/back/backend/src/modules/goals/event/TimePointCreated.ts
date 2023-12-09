import { TimePointEntity } from "entities/TimePoint";

import { getCurrentUser } from "modules/auth";

export class TimePointCreated {
  static eventName = "timepoint.created";

  constructor(public timePoint: TimePointEntity, public triggerUserId = getCurrentUser()?.userId) {}
}