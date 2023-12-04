import { Page } from "@app/front-kit";

import UserCreateView from "views/Users/Create";

import { UserDetailStorage } from "core/storages/user/userDetail";

class CreateUserPage extends Page {
  constructor() {
    super(UserCreateView, [UserDetailStorage]);
  }
}

const page = new CreateUserPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
