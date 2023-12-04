import { getCurrentUser } from "modules/auth";

export class CorrespondenceRevisionCommentUpdated {
  static eventName = "correspondence.revision.comment.updated";

  constructor(public commentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
