import { Page } from "@app/front-kit";

import CreateDocumentRevision from "views/DocumentRevisions/Create";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { UserFlowStorage } from "core/storages/user-flow";

class CreateDocumentRevisionPage extends Page {
  constructor() {
    super(CreateDocumentRevision, [DocumentRevisionsStorage, UserFlowStorage]);
  }
}

const page = new CreateDocumentRevisionPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
