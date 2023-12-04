import { Page } from "@app/front-kit";

import LoginView from "views/Auth/Login";

class LoginPage extends Page {
  constructor() {
    super(LoginView, []);
  }
}

const page = new LoginPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
