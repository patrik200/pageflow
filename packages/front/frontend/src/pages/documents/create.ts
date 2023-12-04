import { Page } from "@app/front-kit";

import DocumentCreate from "views/Documents/Create";

import { DocumentStorage } from "core/storages/document";
import { UserFlowStorage } from "core/storages/user-flow";
import { AttributesStorage } from "core/storages/attributes";

class DocumentCreatePage extends Page {
  constructor() {
    super(DocumentCreate, [DocumentStorage, UserFlowStorage, AttributesStorage]);
  }
}

const page = new DocumentCreatePage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
