import { getCurrentUser } from "modules/auth";

export class DocumentRevisionDiscussionCreated {
  static eventName = "document.revision.discussion.created";

  constructor(public discussionId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
