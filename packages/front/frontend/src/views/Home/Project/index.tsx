import React from "react";
import { observer } from "mobx-react-lite";

import { ProjectEntity } from "core/entities/project/project";

import HomeTableRowTemplate from "../TableRowTemplate";

interface HomeProjectInterface {
  project: ProjectEntity;
}

function HomeProject({ project }: HomeProjectInterface) {
  return <HomeTableRowTemplate title={project.name} href={`/projects/${project.id}`} />;
}

export default observer(HomeProject);
