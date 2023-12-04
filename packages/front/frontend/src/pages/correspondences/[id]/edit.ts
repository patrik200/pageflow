import { Page } from "@app/front-kit";

import EditCorrespondence from "views/Correspondences/Edit";

import { CorrespondenceStorage } from "core/storages/correspondence";
import { AttributesStorage } from "core/storages/attributes";

class EditCorrespondencePage extends Page {
  constructor() {
    super(EditCorrespondence, [CorrespondenceStorage, AttributesStorage]);
  }
}

const page = new EditCorrespondencePage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
