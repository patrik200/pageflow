import { getCurrentUser } from "modules/auth";

export class TicketBoardUpdated {
  static eventName = "ticketBoard.updated";

  constructor(public boardId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
