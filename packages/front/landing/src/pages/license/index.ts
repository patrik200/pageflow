import { Page } from "@app/front-kit";

import LicenseView from "views/License";

class LicensePage extends Page {
  constructor() {
    super(LicenseView, []);
  }
}

const page = new LicensePage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
