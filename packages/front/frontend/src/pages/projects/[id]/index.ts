import { Page } from "@app/front-kit";

import ProjectDetailView from "views/Projects/Detail";

import { ProjectStorage } from "core/storages/project";
import { CorrespondenceStorage } from "core/storages/correspondence";
import { DocumentStorage } from "core/storages/document";
import { TicketsStorage } from "core/storages/ticket";
import { TicketCommentsStorage } from "core/storages/ticket/comments";
import { TicketBoardsStorage } from "core/storages/ticket/boards";
import { AttributesStorage } from "core/storages/attributes";

class ProjectDetailPage extends Page {
  constructor() {
    super(ProjectDetailView, [
      ProjectStorage,
      TicketBoardsStorage,
      TicketsStorage,
      TicketCommentsStorage,
      CorrespondenceStorage,
      DocumentStorage,
      AttributesStorage,
    ]);
  }
}

const page = new ProjectDetailPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
