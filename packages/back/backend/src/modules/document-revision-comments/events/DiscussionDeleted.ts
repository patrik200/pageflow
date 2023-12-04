import { getCurrentUser } from "modules/auth";

export class DocumentRevisionDiscussionDeleted {
  static eventName = "document.revision.discussion.deleted";

  constructor(public discussionId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
