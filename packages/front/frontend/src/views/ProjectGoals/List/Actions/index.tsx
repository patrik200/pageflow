import React from "react";
import { observer } from "mobx-react-lite";

import CreateGoalAction from "./CreateGoal";

function GoalActions() {
  return (
    <>
      <CreateGoalAction />
    </>
  );
}

export default observer(GoalActions);
