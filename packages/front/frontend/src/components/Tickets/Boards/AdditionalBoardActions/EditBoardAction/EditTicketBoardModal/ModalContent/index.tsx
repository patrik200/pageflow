import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox, ModalActions, ModalTitle, TextField } from "@app/ui-kit";
import { getErrorMessageWithCommonIntl, useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn, useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { TicketBoardEntity } from "core/entities/ticket/ticketBoard";
import { EditTicketBoardEntity } from "core/storages/ticket/entities/EditTicketBoard";

import { TicketBoardsStorage } from "core/storages/ticket/boards";

import { wrapperStyles } from "./style.css";

interface EditTicketBoardModalContentInterface {
  boardId?: string;
  projectId?: string;
  onClose: () => void;
  onSuccess?: (entity: TicketBoardEntity) => void;
}

function EditTicketBoardModalContent({ projectId, boardId, onClose, onSuccess }: EditTicketBoardModalContentInterface) {
  const { t } = useTranslation("tickets");
  const { boards, createTicketBoard, editTicketBoard } = useViewContext().containerInstance.get(TicketBoardsStorage);
  const board = useObservableAsDeferredMemo(
    (boards) => (boardId ? boards.find((board) => board.id === boardId) : undefined),
    [boardId],
    boards,
  );

  const entity = React.useMemo(
    () =>
      board ? EditTicketBoardEntity.buildFromTicketBoardEntity(board) : EditTicketBoardEntity.buildEmpty(projectId),
    [board, projectId],
  );

  const handleEditTicketBoard = React.useCallback(async () => {
    const result = board ? await editTicketBoard(entity) : await createTicketBoard(entity);
    if (result.success) {
      onClose();
      onSuccess?.(result.data);
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({
        scope: "edit_board_modal",
        place: "error_messages",
        name: "unexpected",
        parameter: board ? "edit" : "create",
      }),
    );
  }, [board, createTicketBoard, editTicketBoard, entity, onClose, onSuccess, t]);

  const [{ loading }, asyncHandleEditTicketBoard] = useAsyncFn(handleEditTicketBoard, [handleEditTicketBoard]);

  const handleSubmit = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleEditTicketBoard }),
    [asyncHandleEditTicketBoard, entity],
  );

  return (
    <>
      <ModalTitle>{t({ scope: "edit_board_modal", name: "title", parameter: board ? "edit" : "create" })}</ModalTitle>
      <div className={wrapperStyles}>
        <TextField
          placeholder={t({ scope: "edit_board_modal", name: "name_field", parameter: "placeholder" })}
          required
          value={entity.name}
          errorMessage={getErrorMessageWithCommonIntl(entity.viewErrors.name, t)}
          onChangeInput={entity.setName}
        />
        <Checkbox value={entity.isPrivate} onChange={entity.setIsPrivate}>
          {t({ scope: "edit_board_modal", name: "private_field", parameter: "placeholder" })}
        </Checkbox>
      </div>
      <ModalActions
        primaryActionText={t({ scope: "edit_board_modal", place: "actions", name: board ? "save" : "create" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={handleSubmit}
      />
    </>
  );
}

export default observer(EditTicketBoardModalContent);
