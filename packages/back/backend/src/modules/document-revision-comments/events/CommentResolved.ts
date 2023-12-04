import { getCurrentUser } from "modules/auth";

export class DocumentRevisionCommentResolved {
  static eventName = "document.revision.comment.resolved";

  constructor(public revisionId: string, public commentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
