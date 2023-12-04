import { Page } from "@app/front-kit";

import { GoalStorage } from "core/storages/goal";
import GoalDetailView from "views/ProjectGoals/Detail";

class GoalDetailPage extends Page {
  constructor() {
    super(GoalDetailView, [GoalStorage]);
  }
}

const page = new GoalDetailPage();

export default page.default;
export const getServerSideProps = page.getServerSideProps;