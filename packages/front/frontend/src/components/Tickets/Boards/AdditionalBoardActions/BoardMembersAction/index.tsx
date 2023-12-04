import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { useTranslation } from "@app/front-kit";

import { AdditionalActionButton } from "components/AdditionalActions";

import { TicketBoardEntity } from "core/entities/ticket/ticketBoard";

import BoardMembersModal from "./BoardMembersModal";

interface BoardMembersActionInterface {
  board: TicketBoardEntity;
  onOpenedChange: (opened: boolean) => void;
}

function BoardMembersAction({ board, onOpenedChange }: BoardMembersActionInterface) {
  const { t } = useTranslation("tickets");

  const [opened, open, close] = useBoolean(false);
  React.useEffect(() => onOpenedChange(opened), [opened, onOpenedChange]);

  return (
    <>
      <AdditionalActionButton text={t({ scope: "actions", place: "edit_members", name: "button" })} onClick={open} />
      <BoardMembersModal opened={opened} boardId={board.id} onClose={close} />
    </>
  );
}

export default observer(BoardMembersAction);
