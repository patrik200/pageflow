import { GoalEntity } from "entities/Goal/Goal";

import { getCurrentUser } from "modules/auth";

export class GoalCreated {
  static eventName = "goal.created";

  constructor(public goal: GoalEntity, public triggerUserId = getCurrentUser()?.userId) {}
}
