import { Page } from "@app/front-kit";

import ResetPasswordFinish from "views/Auth/ResetPasswordFinish";

class ResetPasswordFinishPage extends Page {
  constructor() {
    super(ResetPasswordFinish, []);
  }
}

const page = new ResetPasswordFinishPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;
