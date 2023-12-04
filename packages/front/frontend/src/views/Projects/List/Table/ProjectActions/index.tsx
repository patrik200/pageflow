import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActionFavourite from "components/AdditionalActionFavourite";
import ActionsTableCell from "components/ActionsTableCell";

import { ProjectEntity } from "core/entities/project/project";

import { ProjectStorage } from "core/storages/project";

interface ProjectActionsInterface {
  entity: ProjectEntity;
}

function ProjectActions({ entity }: ProjectActionsInterface) {
  const { setFavourite } = useViewContext().containerInstance.get(ProjectStorage);

  const handleSetFavourite = React.useCallback(
    (favourite: boolean) => setFavourite(entity.id, favourite),
    [entity.id, setFavourite],
  );

  return (
    <ActionsTableCell size="32">
      <AdditionalActionFavourite favourite={entity.favourite} onChange={handleSetFavourite} />
    </ActionsTableCell>
  );
}

export default observer(ProjectActions);
