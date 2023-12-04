import { Page } from "@app/front-kit";

import RevisionDetailEditView from "views/CorrespondenceRevisions/Edit";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";
import { CorrespondenceStorage } from "core/storages/correspondence";

class CorrespondenceRevisionDetailEditPage extends Page {
  constructor() {
    super(RevisionDetailEditView, [CorrespondenceStorage, CorrespondenceRevisionsStorage]);
  }
}

const page = new CorrespondenceRevisionDetailEditPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
