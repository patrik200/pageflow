import React from "react";
import { Button } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import { TicketsStorage } from "core/storages/ticket";

import { containerStyles } from "./style.css";

interface EditActionsInterface {
  entity: EditTicketEntity;
  onCancel: () => void;
}

function EditActions({ entity, onCancel }: EditActionsInterface) {
  const { t } = useTranslation("ticket-detail");

  const { updateTicket } = useViewContext().containerInstance.get(TicketsStorage);

  const handleUpdateTicket = React.useCallback(async () => {
    const result = await updateTicket(entity);
    if (result.success) {
      emitRequestErrorFiles(result, t);
      onCancel();
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "ticket_modal", place: "update", name: "error_messages", parameter: "unexpected" }),
    );
  }, [entity, onCancel, t, updateTicket]);

  const [{ loading }, asyncHandleUpdateTicket] = useAsyncFn(handleUpdateTicket, [handleUpdateTicket]);

  const handleUpdateTicketClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleUpdateTicket }),
    [entity, asyncHandleUpdateTicket],
  );

  return (
    <div className={containerStyles}>
      <Button size="SMALL" type="OUTLINE" disabled={loading} onClick={onCancel}>
        {t({ scope: "ticket_modal", place: "actions", name: "cancel_editing" })}
      </Button>
      <Button size="SMALL" loading={loading} onClick={handleUpdateTicketClick}>
        {t({ scope: "ticket_modal", place: "actions", name: "save" })}
      </Button>
    </div>
  );
}

export default React.memo(EditActions);
