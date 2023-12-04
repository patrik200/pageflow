import { Page } from "@app/front-kit";

import UserFlowListView from "views/UserFlow/List";

import { UserFlowStorage } from "core/storages/user-flow";

class UserFlowPage extends Page {
  constructor() {
    super(UserFlowListView, [UserFlowStorage]);
  }
}

const page = new UserFlowPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
