import React from "react";
import { observer } from "mobx-react-lite";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import ProjectEditAction from "./Edit";
import AdditionalProjectAction from "./DeleteAction";
import ProjectFavouriteAction from "./Favourite";
import ProjectEditStatusAction from "../../ProjectMoveToCompletedStatus";

interface ProjectActionsInterface {
  project: ProjectDetailEntity;
}

function ProjectActions({ project }: ProjectActionsInterface) {
  return (
    <>
      <div>
        <ProjectEditStatusAction project={project} />
      </div>
      <ProjectEditAction project={project} />
      <div>
        <ProjectFavouriteAction project={project} />
        <AdditionalProjectAction project={project} />
      </div>
    </>
  );
}

export default observer(ProjectActions);
