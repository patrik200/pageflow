import { getCurrentUser } from "modules/auth";

export class TicketCreated {
  static eventName = "ticket.created";

  constructor(public ticketId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
