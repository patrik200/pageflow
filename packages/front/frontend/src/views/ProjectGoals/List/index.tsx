import { observer } from "mobx-react-lite";

import Detail from "views/ProjectGoals/Detail";

import { GoalEntity } from "core/entities/goal/goal";
import Actions from "./Actions";
import CreateGoal from "./Actions/CreateGoal";

interface GoalsTableInterface {
  goals: GoalEntity[];
}

function GoalsList({ goals }: GoalsTableInterface) {
  return (
    <div>
      <CreateGoal />
      {goals.map((goal, index) => (
        <Detail key={index} goal={goal} />
      ))}
    </div>
  );
}

export default observer(GoalsList);
