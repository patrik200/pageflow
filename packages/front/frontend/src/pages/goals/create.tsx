import { Page } from "@app/front-kit";

import { GoalStorage } from "core/storages/goal";
import CreateGoalView from "views/ProjectGoals/Create";

class GoalCreatePage extends Page {
  constructor() {
    super(CreateGoalView, [GoalStorage]);
  }
}

const page = new GoalCreatePage();
  
export default page.default;
export const getServerSideProps = page.getServerSideProps;