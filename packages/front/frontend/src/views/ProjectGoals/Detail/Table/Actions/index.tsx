import React from "react";
import { observer } from "mobx-react-lite";

import ActionsTableCell from "components/ActionsTableCell";


import { TimepointEntity } from "core/entities/goal/timepoint";
import DeleteButton from "./DeleteTimepoint";
import EditTimepoint from "./EditTimepoint";

interface TimepointActionsInterface {
  entity: TimepointEntity;
}

function TimepointActions({ entity }: TimepointActionsInterface) {
  const [deleteOpened, setDeleteOpened] = React.useState(false);

  return (
    <ActionsTableCell size="160">
        <DeleteButton entity={entity} onOpenedChange={setDeleteOpened} />
        <EditTimepoint entity={entity} />
    </ActionsTableCell>
  );
}

export default observer(TimepointActions);