import { CorrespondenceRevisionEntity } from "entities/Correspondence/Correspondence/Revision";

import { getCurrentUser } from "modules/auth";

export class CorrespondenceRevisionUpdated {
  static eventName = "correspondence.revision.updated";

  constructor(
    public revisionId: string,
    public oldRevision: CorrespondenceRevisionEntity,
    public triggerUserId = getCurrentUser()?.userId,
  ) {}
}
