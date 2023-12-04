import { getCurrentUser } from "modules/auth";

export class DocumentRevisionCommentDeleted {
  static eventName = "document.revision.comment.deleted";

  constructor(public revisionId: string, public commentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
