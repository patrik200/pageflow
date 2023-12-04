import { getCurrentUser } from "modules/auth";

export class ProjectCreated {
  static eventName = "project.created";

  constructor(public projectId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
