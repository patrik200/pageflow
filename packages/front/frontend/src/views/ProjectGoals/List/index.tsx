import React from "react";
import { observer } from "mobx-react-lite";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import CardLoading from "components/Card/pressets/CardLoading";

import Detail from "views/ProjectGoals/Detail";

import { GoalStorage } from "core/storages/goal";

import CreateGoal from "./Actions/CreateGoal";

interface GoalsTableInterface {
  projectId: string;
}

function GoalsList({ projectId }: GoalsTableInterface) {
  const { loadGoals, goals } = useViewContext().containerInstance.get(GoalStorage);

  const [{ loading }, asyncLoadGoals] = useAsyncFn(loadGoals, [loadGoals], { loading: true });

  React.useEffect(() => void asyncLoadGoals(projectId), [asyncLoadGoals, projectId]);

  if (loading || !goals) return <CardLoading />;

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
