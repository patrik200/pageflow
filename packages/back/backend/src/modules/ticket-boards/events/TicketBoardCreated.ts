import { TicketBoardEntity } from "entities/TicketBoard";

import { getCurrentUser } from "modules/auth";

export class TicketBoardCreated {
  static eventName = "ticketBoard.created";

  constructor(public board: TicketBoardEntity, public triggerUserId = getCurrentUser()?.userId) {}
}
