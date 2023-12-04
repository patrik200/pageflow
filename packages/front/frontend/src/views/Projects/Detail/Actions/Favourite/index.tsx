import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActionFavourite from "components/AdditionalActionFavourite";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import { ProjectStorage } from "core/storages/project";

interface ProjectFavouriteActionInterface {
  project: ProjectDetailEntity;
}

function ProjectFavouriteAction({ project }: ProjectFavouriteActionInterface) {
  const { setFavourite } = useViewContext().containerInstance.get(ProjectStorage);

  const handleSetFavourite = React.useCallback(
    (favourite: boolean) => setFavourite(project.id, favourite),
    [project.id, setFavourite],
  );

  return <AdditionalActionFavourite favourite={project.favourite} onChange={handleSetFavourite} />;
}

export default observer(ProjectFavouriteAction);
