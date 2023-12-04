import { Page } from "@app/front-kit";

import HomeView from "views/Home";

class IndexPage extends Page {
  constructor() {
    super(HomeView, []);
  }
}

const page = new IndexPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
