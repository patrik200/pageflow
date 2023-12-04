import { Page } from "@app/front-kit";

import TicketCreateView from "views/Tickets/Create";

import { TicketsStorage } from "core/storages/ticket";
import { TicketCommentsStorage } from "core/storages/ticket/comments";

class TicketCreatePage extends Page {
  constructor() {
    super(TicketCreateView, [TicketsStorage, TicketCommentsStorage]);
  }
}

const page = new TicketCreatePage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
