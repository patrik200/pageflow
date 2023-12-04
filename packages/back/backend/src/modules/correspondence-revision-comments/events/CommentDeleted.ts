import { getCurrentUser } from "modules/auth";

export class CorrespondenceRevisionCommentDeleted {
  static eventName = "correspondence.revision.comment.deleted";

  constructor(public commentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
