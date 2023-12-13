import React from "react";
import { observer } from "mobx-react-lite";

import CreateGoalAction from "./CreateGoal";
import Card from "components/Card";

function GoalActions() {
  return (
    <Card>
      <CreateGoalAction />
    </Card>
  );
}

export default observer(GoalActions);
