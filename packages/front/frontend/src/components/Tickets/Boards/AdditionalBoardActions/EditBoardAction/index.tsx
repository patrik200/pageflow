import React from "react";
import { observer } from "mobx-react-lite";
import { useBoolean } from "@worksolutions/react-utils";
import { useTranslation } from "@app/front-kit";

import { AdditionalActionButton } from "components/AdditionalActions";

import { TicketBoardEntity } from "core/entities/ticket/ticketBoard";

import EditTicketBoardModal from "./EditTicketBoardModal";

interface EditBoardActionInterface {
  board: TicketBoardEntity;
  onOpenedChange: (opened: boolean) => void;
}

function EditBoardAction({ board, onOpenedChange }: EditBoardActionInterface) {
  const { t } = useTranslation("tickets");

  const [opened, open, close] = useBoolean(false);
  React.useEffect(() => onOpenedChange(opened), [opened, onOpenedChange]);

  if (!board.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton text={t({ scope: "actions", place: "edit_board", name: "button" })} onClick={open} />
      <EditTicketBoardModal opened={opened} boardId={board.id} onClose={close} />
    </>
  );
}

export default observer(EditBoardAction);
