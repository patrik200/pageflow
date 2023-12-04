import React from "react";
import { useRouter } from "@app/front-kit";

import { GoalFilterEntity } from "core/storages/goal/entities/GoalFilter";

export function useGoalRouter(entity: GoalFilterEntity){
    const { query, push } = useRouter();
    const path = (query.cPath ?? null) as string | null;
    React.useMemo(() => {
      if (path === entity.goalId) return;
      entity.setGoalId(path);
    }, [entity, path]);
  
    React.useEffect(() => {
      if (path === entity.goalId) return;
      push.current(
        { pathname: "/projects/[id]", query: { id: entity._projectId, cPath: entity.goalId } },
        { shallow: true },
      );
    }, [entity._projectId, entity.goalId, path, push]);  
}