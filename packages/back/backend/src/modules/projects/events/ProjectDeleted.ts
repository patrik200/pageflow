import { getCurrentUser } from "modules/auth";

export class ProjectDeleted {
  static eventName = "project.deleted";

  constructor(public projectId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
