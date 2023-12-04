import React from "react";
import { observer } from "mobx-react-lite";

import AdditionalActions from "components/AdditionalActions";

import { TicketBoardEntity } from "core/entities/ticket/ticketBoard";

import EditBoardAction from "./EditBoardAction";
import DeleteBoardAction from "./DeleteBoardAction";
import BoardMembersAction from "./BoardMembersAction";

interface AdditionalBoardActionsInterface {
  board: TicketBoardEntity;
}

function AdditionalBoardActions({ board }: AdditionalBoardActionsInterface) {
  const [editOpened, setEditOpened] = React.useState(false);
  const [membersOpened, setMembersOpened] = React.useState(false);
  const [deleteOpened, setDeleteOpened] = React.useState(false);

  return (
    <AdditionalActions closeOnClickOutside={!editOpened && !membersOpened && !deleteOpened}>
      <EditBoardAction board={board} onOpenedChange={setEditOpened} />
      <BoardMembersAction board={board} onOpenedChange={setMembersOpened} />
      <DeleteBoardAction board={board} onOpenedChange={setDeleteOpened} />
    </AdditionalActions>
  );
}

export default observer(AdditionalBoardActions);
