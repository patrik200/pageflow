import { Page } from "@app/front-kit";

import RevisionDetailView from "views/CorrespondenceRevisions/Detail";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";
import { CorrespondenceRevisionCommentsStorage } from "core/storages/correspondence/revisionComments";
import { CorrespondenceStorage } from "core/storages/correspondence";

class CorrespondenceRevisionDetailPage extends Page {
  constructor() {
    super(RevisionDetailView, [
      CorrespondenceStorage,
      CorrespondenceRevisionsStorage,
      CorrespondenceRevisionCommentsStorage,
    ]);
  }
}

const page = new CorrespondenceRevisionDetailPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
