import { getCurrentUser } from "modules/auth";

export class DocumentRevisionDiscussionUpdated {
  static eventName = "document.revision.discussion.updated";

  constructor(public discussionId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
