import React from "react";
import { observer } from "mobx-react-lite";

import { GoalEntity } from "core/entities/goal/goal";

import DeleteButton from "./DeleteGoal";
import EditGoalAction from "./EditGoal";

interface GoalActionsInterface {
  goal: GoalEntity;
}

function GoalActions({ goal }: GoalActionsInterface) {
  return (
    <div>
      <DeleteButton entity={goal} />
      <EditGoalAction entity={goal} />
    </div>
  );
}

export default observer(GoalActions);
