import { Page } from "@app/front-kit";

import CreateCorrespondenceRevision from "views/CorrespondenceRevisions/Create";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

class CreateCorrespondenceRevisionPage extends Page {
  constructor() {
    super(CreateCorrespondenceRevision, [CorrespondenceRevisionsStorage]);
  }
}

const page = new CreateCorrespondenceRevisionPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
