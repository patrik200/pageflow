import { TicketEntity } from "entities/Ticket";

import { getCurrentUser } from "modules/auth";

export class TicketUpdated {
  static eventName = "ticket.updated";

  constructor(
    public ticketId: string,
    public oldTicket: TicketEntity,
    public triggerUserId = getCurrentUser()?.userId,
  ) {}
}
