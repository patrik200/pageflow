import { observer } from "mobx-react-lite";
import { GoalEntity } from "core/entities/goal/goal";
import EditGoalAction from "./Edit";

interface GoalActionsInterface {
    entity: GoalEntity;
}

function GoalActions({ entity }: GoalActionsInterface) {
    return <><EditGoalAction entity={entity} /></>
}

export default observer(GoalActions);