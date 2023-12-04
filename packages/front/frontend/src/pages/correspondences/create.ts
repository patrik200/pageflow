import { Page } from "@app/front-kit";

import CorrespondenceCreate from "views/Correspondences/Create";

import { CorrespondenceStorage } from "core/storages/correspondence";

class CorrespondenceCreatePage extends Page {
  constructor() {
    super(CorrespondenceCreate, [CorrespondenceStorage]);
  }
}

const page = new CorrespondenceCreatePage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
