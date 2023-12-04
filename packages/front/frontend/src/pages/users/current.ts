import { Page } from "@app/front-kit";

import ProfileView from "views/Users/Profile";

import { UserDetailStorage } from "core/storages/user/userDetail";

class ProfilePage extends Page {
  constructor() {
    super(ProfileView, [UserDetailStorage]);
  }
}

const page = new ProfilePage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
