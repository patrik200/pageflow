import { Page } from "@app/front-kit";

import EditDocument from "views/Documents/Edit";

import { DocumentStorage } from "core/storages/document";
import { UserFlowStorage } from "core/storages/user-flow";
import { AttributesStorage } from "core/storages/attributes";

class EditDocumentPage extends Page {
  constructor() {
    super(EditDocument, [DocumentStorage, UserFlowStorage, AttributesStorage]);
  }
}

const page = new EditDocumentPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
