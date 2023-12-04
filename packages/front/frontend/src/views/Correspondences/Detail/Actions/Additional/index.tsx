import React from "react";
import { observer } from "mobx-react-lite";

import AdditionalActions from "components/AdditionalActions";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import MoveCorrespondenceAction from "./Move";
import DeleteCorrespondenceAction from "./Delete";
import ActiveCorrespondenceAction from "./Active";
import ArchiveCorrespondenceAction from "./Archive";

interface CorrespondenceAdditionalActionsInterface {
  correspondence: CorrespondenceEntity;
}

function CorrespondenceAdditionalActions({ correspondence }: CorrespondenceAdditionalActionsInterface) {
  const [deleteOpened, setDeleteOpened] = React.useState(false);
  const [moveOpened, setMoveOpened] = React.useState(false);

  return (
    <AdditionalActions closeOnClickOutside={!deleteOpened && !moveOpened}>
      <ActiveCorrespondenceAction correspondence={correspondence} />
      <ArchiveCorrespondenceAction correspondence={correspondence} />
      <MoveCorrespondenceAction correspondence={correspondence} onOpenedChange={setMoveOpened} />
      <DeleteCorrespondenceAction correspondence={correspondence} onOpenedChange={setDeleteOpened} />
    </AdditionalActions>
  );
}

export default observer(CorrespondenceAdditionalActions);
