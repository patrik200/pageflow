import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActions from "components/AdditionalActions";
import AdditionalActionFavourite from "components/AdditionalActionFavourite";
import ActionsTableCell from "components/ActionsTableCell";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import { CorrespondenceStorage } from "core/storages/correspondence";

import MoveCorrespondenceAction from "./Move";

interface CorrespondenceActionsInterface {
  entity: CorrespondenceEntity;
}

function CorrespondenceActions({ entity }: CorrespondenceActionsInterface) {
  const [moveOpened, setMoveOpened] = React.useState(false);
  const { setCorrespondenceFavourite } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const handleFavourite = React.useCallback(
    (favourite: boolean) => setCorrespondenceFavourite(entity.id, favourite),
    [entity.id, setCorrespondenceFavourite],
  );

  return (
    <ActionsTableCell size="160">
      <AdditionalActionFavourite favourite={entity.favourite} onChange={handleFavourite} />
      <AdditionalActions closeOnClickOutside={!moveOpened}>
        <MoveCorrespondenceAction entity={entity} onOpenedChange={setMoveOpened} />
      </AdditionalActions>
    </ActionsTableCell>
  );
}

export default observer(CorrespondenceActions);
