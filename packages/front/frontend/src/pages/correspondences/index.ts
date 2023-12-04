import { Page } from "@app/front-kit";

import CorrespondencesList from "views/Correspondences/List";

import { CorrespondenceStorage } from "core/storages/correspondence";
import { AttributesStorage } from "core/storages/attributes";

class CorrespondencesListPage extends Page {
  constructor() {
    super(CorrespondencesList, [CorrespondenceStorage, AttributesStorage]);
  }
}

const page = new CorrespondencesListPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
