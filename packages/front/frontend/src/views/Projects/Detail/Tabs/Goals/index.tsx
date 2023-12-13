import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import GoalsList from "views/ProjectGoals/List";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import { GoalStorage } from "core/storages/goal";

import { useGoalRouter } from "./hooks/useRouter";

interface ProjectGoalsTabInterface {
    project: ProjectDetailEntity;
}

function ProjectGoalsTab({ project }: ProjectGoalsTabInterface) {
    const goalStorage = useViewContext().containerInstance.get(GoalStorage);

    React.useMemo(() => goalStorage.initGoalFilter(project.id), [goalStorage, project.id]);

    useGoalRouter(goalStorage.filter!);
    return (
        <>
            <GoalsList goals={project.goals} />
        </>
    );
}

export default observer(ProjectGoalsTab);
