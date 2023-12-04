import React from "react";
import { observer } from "mobx-react-lite";
import { ModalActions, ModalTitle } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

import { TicketsStorage } from "core/storages/ticket";

import { actionsStyles, wrapperStyles } from "./style.css";

interface DeleteTicketModalContentInterface {
  ticket: TicketDetailEntity;
  onClose: () => void;
  onSuccess?: () => void;
}

function DeleteTicketModalContent({ ticket, onClose, onSuccess }: DeleteTicketModalContentInterface) {
  const { t } = useTranslation("ticket-detail");
  const { deleteTicket } = useViewContext().containerInstance.get(TicketsStorage);

  const handleDeleteTicket = React.useCallback(async () => {
    const result = await deleteTicket(ticket.id);
    if (result.success) {
      onClose();
      onSuccess?.();
      emitRequestSuccess(t({ scope: "delete_ticket_modal", name: "success_message" }));
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "delete_ticket_modal", name: "error_messages", parameter: "unexpected" }),
    );
  }, [deleteTicket, onClose, onSuccess, t, ticket.id]);

  const [{ loading }, asyncHandleDeleteTicket] = useAsyncFn(handleDeleteTicket, [handleDeleteTicket]);

  return (
    <div className={wrapperStyles}>
      <ModalTitle>{t({ scope: "delete_ticket_modal", name: "title" }, { name: ticket.name })}</ModalTitle>
      <ModalActions
        className={actionsStyles}
        primaryActionText={t({ scope: "delete_ticket_modal", place: "actions", name: "delete" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={asyncHandleDeleteTicket}
      />
    </div>
  );
}

export default observer(DeleteTicketModalContent);
