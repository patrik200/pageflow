import { Page } from "@app/front-kit";

import CorrespondenceDetail from "views/Correspondences/Detail";

import { CorrespondenceStorage } from "core/storages/correspondence";
import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

class CorrespondenceDetailPage extends Page {
  constructor() {
    super(CorrespondenceDetail, [CorrespondenceStorage, CorrespondenceRevisionsStorage]);
  }
}

const page = new CorrespondenceDetailPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
