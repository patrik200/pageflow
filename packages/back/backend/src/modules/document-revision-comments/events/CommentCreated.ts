import { getCurrentUser } from "modules/auth";

export class DocumentRevisionCommentCreated {
  static eventName = "document.revision.comment.created";

  constructor(public commentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
