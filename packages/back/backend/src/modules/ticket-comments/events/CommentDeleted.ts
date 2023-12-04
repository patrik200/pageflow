import { getCurrentUser } from "modules/auth";

export class TicketCommentDeleted {
  static eventName = "ticket.comment.deleted";

  constructor(public commentId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
