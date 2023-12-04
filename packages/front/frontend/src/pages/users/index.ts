import { Page } from "@app/front-kit";

import UsersListView from "views/Users/List";

import { UsersListStorage } from "core/storages/user/usersList";

class UsersPage extends Page {
  constructor() {
    super(UsersListView, [UsersListStorage]);
  }
}

const page = new UsersPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
