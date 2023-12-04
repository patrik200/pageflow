import { getCurrentUser } from "modules/auth";

export class TicketDeleted {
  static eventName = "ticket.deleted";

  constructor(public ticketId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
