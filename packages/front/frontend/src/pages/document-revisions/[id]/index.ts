import { Page } from "@app/front-kit";

import RevisionDetailView from "views/DocumentRevisions/Detail";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentRevisionCommentsStorage } from "core/storages/document/revisionComments";

class DocumentRevisionDetailPage extends Page {
  constructor() {
    super(RevisionDetailView, [DocumentRevisionsStorage, DocumentRevisionCommentsStorage]);
  }
}

const page = new DocumentRevisionDetailPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
