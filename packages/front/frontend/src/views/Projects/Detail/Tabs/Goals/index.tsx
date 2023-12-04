import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import Card from "components/Card";
import CardTablePreset from "components/Card/pressets/CardTable";

import GoalsTable from "views/ProjectGoals/List/Table";
import { ProjectDetailEntity } from "core/entities/project/projectDetail";
import { useGoalRouter } from "./hooks/useRouter";
import { GoalFilterEntity } from "core/storages/goal/entities/GoalFilter";
import Actions from "views/ProjectGoals/List/Actions";
import { GoalStorage } from "core/storages/goal";

interface ProjectGoalsTabInterface {
    project: ProjectDetailEntity;
}

function ProjectGoalsTab({ project }: ProjectGoalsTabInterface) {
    const goalStorage = useViewContext().containerInstance.get(GoalStorage)

    React.useMemo(() => goalStorage.initGoalFilter(project.id), [goalStorage, project.id])

    useGoalRouter(goalStorage.filter!)
    return (
        <>
            <CardTablePreset actions={<Actions />}>
                <GoalsTable goals={project.goals}/>
            </CardTablePreset>
        </>
    );
}

export default observer(ProjectGoalsTab);