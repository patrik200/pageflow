import { getCurrentUser } from "modules/auth";

export class DocumentRevisionCommentUpdated {
  static eventName = "document.revision.comment.updated";

  constructor(public commentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
