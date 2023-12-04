import { Page } from "@app/front-kit"
import { GoalStorage } from "core/storages/goal";
import EditGoalView  from "views/ProjectGoals/Edit";
class GoalEditPage extends Page {
    constructor () {
        super(EditGoalView, [GoalStorage]);        
    }
}

const page = new GoalEditPage();
export default page.default;
export const getServerSideProps = page.getServerSideProps;
