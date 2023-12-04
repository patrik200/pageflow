import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { TicketBoardsStorage } from "core/storages/ticket/boards";

import { titleStyles } from "./style.css";

type DeleteTicketBoardModalContentInterface = {
  boardId: string;
  onClose: () => void;
  onSuccess?: () => void;
};

function DeleteTicketBoardModalContent({ boardId, onClose, onSuccess }: DeleteTicketBoardModalContentInterface) {
  const { t } = useTranslation("tickets");
  const { deleteTicketBoard } = useViewContext().containerInstance.get(TicketBoardsStorage);

  const handleDeleteTicketBoard = React.useCallback(async () => {
    const result = await deleteTicketBoard(boardId);
    if (result.success) {
      onClose();
      onSuccess?.();
      emitRequestSuccess(t({ scope: "delete_board_modal", name: "success_message" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "delete_board_modal", place: "error_messages", name: "unexpected" }),
    );
  }, [boardId, deleteTicketBoard, onClose, onSuccess, t]);

  const [{ loading }, asyncHandleDeleteTicketBoard] = useAsyncFn(handleDeleteTicketBoard, [handleDeleteTicketBoard]);

  const handleSubmit = React.useCallback(() => asyncHandleDeleteTicketBoard(), [asyncHandleDeleteTicketBoard]);

  return (
    <>
      <ModalTitle className={titleStyles}>{t({ scope: "delete_board_modal", name: "title" })}</ModalTitle>
      <ModalActions
        primaryActionText={t({ scope: "delete_board_modal", place: "actions", name: "delete" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleSubmit}
      />
    </>
  );
}

export default observer(DeleteTicketBoardModalContent);
