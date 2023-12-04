import { Page } from "@app/front-kit";

import ResetPasswordInitial from "views/Auth/ResetPasswordInitial";

class ResetPasswordInitialPage extends Page {
  constructor() {
    super(ResetPasswordInitial, []);
  }
}

const page = new ResetPasswordInitialPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
