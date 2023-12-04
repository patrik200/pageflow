import { Page } from "@app/front-kit";

import HomeView from "views/Home";

import { HomeStorage } from "core/storages/home";

class IndexPage extends Page {
  constructor() {
    super(HomeView, [HomeStorage]);
  }
}

const page = new IndexPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
