import { Page } from "@app/front-kit";

import DocumentDetail from "views/Documents/Detail";

import { DocumentStorage } from "core/storages/document";
import { DocumentDependenciesStorage } from "core/storages/document/dependencies";
import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { UserFlowStorage } from "core/storages/user-flow";

class DocumentDetailPage extends Page {
  constructor() {
    super(DocumentDetail, [DocumentStorage, DocumentRevisionsStorage, DocumentDependenciesStorage, UserFlowStorage]);
  }
}

const page = new DocumentDetailPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
