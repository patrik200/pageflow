import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { useTranslation } from "@app/front-kit";

import { AdditionalActionButton } from "components/AdditionalActions";

import { TicketBoardEntity } from "core/entities/ticket/ticketBoard";

import DeleteTicketBoardModal from "./DeleteTicketBoardModal";

interface DeleteBoardActionInterface {
  board: TicketBoardEntity;
  onOpenedChange: (opened: boolean) => void;
}

function DeleteBoardAction({ board, onOpenedChange }: DeleteBoardActionInterface) {
  const { t } = useTranslation("tickets");

  const [opened, open, close] = useBoolean(false);
  React.useEffect(() => onOpenedChange(opened), [opened, onOpenedChange]);

  if (!board.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton text={t({ scope: "actions", place: "delete_board", name: "button" })} onClick={open} />
      <DeleteTicketBoardModal opened={opened} boardId={board.id} onClose={close} />
    </>
  );
}

export default observer(DeleteBoardAction);
