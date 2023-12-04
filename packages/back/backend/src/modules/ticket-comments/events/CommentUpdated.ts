import { getCurrentUser } from "modules/auth";

export class TicketCommentUpdated {
  static eventName = "ticket.comment.updated";

  constructor(public commentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
