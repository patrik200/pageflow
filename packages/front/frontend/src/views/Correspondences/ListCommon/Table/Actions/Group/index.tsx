import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActions from "components/AdditionalActions";
import AdditionalActionFavourite from "components/AdditionalActionFavourite";
import ActionsTableCell from "components/ActionsTableCell";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

import { CorrespondenceStorage } from "core/storages/correspondence";

import EditCorrespondenceGroupAction from "./Edit";
import MoveCorrespondenceGroupAction from "./Move";
import DeleteCorrespondenceGroupAction from "./Delete";
import CorrespondenceGroupPermissionsAction from "./Permissions";

interface GroupActionsInterface {
  entity: CorrespondenceGroupEntity;
}

function GroupActions({ entity }: GroupActionsInterface) {
  const [editOpened, setEditOpened] = React.useState(false);
  const [permissionsOpened, setPermissionsOpened] = React.useState(false);
  const [moveOpened, setMoveOpened] = React.useState(false);
  const [deleteOpened, setDeleteOpened] = React.useState(false);

  const { setGroupFavourite } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const handleFavourite = React.useCallback(
    (favourite: boolean) => setGroupFavourite(entity.id, favourite),
    [entity.id, setGroupFavourite],
  );

  return (
    <ActionsTableCell size="160">
      <AdditionalActionFavourite favourite={entity.favourite} onChange={handleFavourite} />
      <AdditionalActions closeOnClickOutside={!editOpened && !permissionsOpened && !moveOpened && !deleteOpened}>
        <EditCorrespondenceGroupAction entity={entity} onOpenedChange={setEditOpened} />
        <CorrespondenceGroupPermissionsAction entity={entity} onOpenedChange={setPermissionsOpened} />
        <MoveCorrespondenceGroupAction entity={entity} onOpenedChange={setMoveOpened} />
        <DeleteCorrespondenceGroupAction entity={entity} onOpenedChange={setDeleteOpened} />
      </AdditionalActions>
    </ActionsTableCell>
  );
}

export default observer(GroupActions);
