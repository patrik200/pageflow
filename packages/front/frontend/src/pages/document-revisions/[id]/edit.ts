import { Page } from "@app/front-kit";

import RevisionDetailEditView from "views/DocumentRevisions/Edit";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

class DocumentRevisionDetailEditPage extends Page {
  constructor() {
    super(RevisionDetailEditView, [DocumentRevisionsStorage]);
  }
}

const page = new DocumentRevisionDetailEditPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
