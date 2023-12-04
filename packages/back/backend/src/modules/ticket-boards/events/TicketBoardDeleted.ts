import { getCurrentUser } from "modules/auth";

export class TicketBoardDeleted {
  static eventName = "ticketBoard.deleted";

  constructor(public boardId: string, public triggerUserId = getCurrentUser()?.userId) {}
}
