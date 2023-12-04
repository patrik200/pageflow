import { Page } from "@app/front-kit";

import TicketsDetailView from "views/Tickets/Detail";

import { TicketsStorage } from "core/storages/ticket";
import { TicketCommentsStorage } from "core/storages/ticket/comments";

class TicketDetailPage extends Page {
  constructor() {
    super(TicketsDetailView, [TicketsStorage, TicketCommentsStorage]);
  }
}

const page = new TicketDetailPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
