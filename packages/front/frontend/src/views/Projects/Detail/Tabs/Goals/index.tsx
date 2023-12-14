import React from "react";
import { observer } from "mobx-react-lite";

import GoalsList from "views/ProjectGoals/List";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

interface ProjectGoalsTabInterface {
    project: ProjectDetailEntity;
}

function ProjectGoalsTab({ project }: ProjectGoalsTabInterface) {
    return (
        <>
            <GoalsList projectId={project.id} />
        </>
    );
}

export default observer(ProjectGoalsTab);
