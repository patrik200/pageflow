import { Page } from "@app/front-kit";

import TermsView from "views/Terms";

class TermsPage extends Page {
  constructor() {
    super(TermsView, []);
  }
}

const page = new TermsPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
