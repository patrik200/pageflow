import { Page } from "@app/front-kit";

import PrivacyView from "views/Privacy";

class PrivacyPage extends Page {
  constructor() {
    super(PrivacyView, []);
  }
}

const page = new PrivacyPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
