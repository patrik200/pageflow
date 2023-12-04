import { getCurrentUser } from "modules/auth";

export class CorrespondenceRevisionCommentCreated {
  static eventName = "correspondence.revision.comment.created";

  constructor(public commentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
