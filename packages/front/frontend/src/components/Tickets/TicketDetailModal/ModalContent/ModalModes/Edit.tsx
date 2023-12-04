import React from "react";
import { observer } from "mobx-react-lite";
import { createPortal } from "react-dom";
import { ModalTitle } from "@app/ui-kit";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";
import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import EditFromDetailTicketCard, { EditTicketCardActions } from "../ContentModes/Edit";

import { titleStyles } from "../style.css";

interface TicketDetailModalEditModeInterface {
  ticket: TicketDetailEntity;
  disableEditMode: () => void;
}

function TicketDetailModalEditMode({ ticket, disableEditMode }: TicketDetailModalEditModeInterface) {
  const entity = React.useMemo(() => EditTicketEntity.buildFromTicketEntity(ticket), [ticket]);

  return (
    <>
      <EditFromDetailTicketCard entity={entity} />
      {createPortal(
        <>
          <ModalTitle className={titleStyles}>{ticket.name}</ModalTitle>
          <EditTicketCardActions entity={entity} onCancel={disableEditMode} />
        </>,
        document.getElementById("ticket-modal-header")!,
      )}
    </>
  );
}

export default observer(TicketDetailModalEditMode);
