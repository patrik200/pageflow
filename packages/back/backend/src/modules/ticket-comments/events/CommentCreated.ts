import { TicketCommentEntity } from "entities/Ticket/Comment";

import { getCurrentUser } from "modules/auth";

export class TicketCommentCreated {
  static eventName = "ticket.comment.created";

  constructor(public comment: TicketCommentEntity, public triggerUserId = getCurrentUser()?.userId) {}
}
