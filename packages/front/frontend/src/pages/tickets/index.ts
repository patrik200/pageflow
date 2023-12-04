import { Page } from "@app/front-kit";

import TicketsList from "views/Tickets/List";

import { TicketBoardsStorage } from "core/storages/ticket/boards";
import { TicketsStorage } from "core/storages/ticket";
import { TicketCommentsStorage } from "core/storages/ticket/comments";

class TicketsPage extends Page {
  constructor() {
    super(TicketsList, [TicketBoardsStorage, TicketsStorage, TicketCommentsStorage]);
  }
}

const page = new TicketsPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
