import { ProjectEntity } from "entities/Project";

import { getCurrentUser } from "modules/auth";

export class ProjectUpdated {
  static eventName = "project.updated";

  constructor(
    public projectId: string,
    public oldProject: ProjectEntity,
    public triggerUserId = getCurrentUser()?.userId,
  ) {}
}
