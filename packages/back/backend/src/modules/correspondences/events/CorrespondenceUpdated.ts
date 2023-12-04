import { CorrespondenceEntity } from "entities/Correspondence/Correspondence";

import { getCurrentUser } from "modules/auth";

export class CorrespondenceUpdated {
  static eventName = "correspondence.updated";

  constructor(
    public correspondenceId: string,
    public oldCorrespondence: CorrespondenceEntity,
    public triggerUserId = getCurrentUser()?.userId,
  ) {}
}
