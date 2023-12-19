import React from "react";
import { observer } from "mobx-react-lite";
import { createPortal } from "react-dom";
import { ModalTitle } from "@app/ui-kit";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

import ViewTicketCard, { ViewTicketCardActions } from "../../ContentModes/View";
import TicketSlug from "../../Slug";
import { titleStyles } from "../../style.css";

import { slugStyles } from "./style.css";

interface TicketDetailModalEditViewInterface {
  ticket: TicketDetailEntity;
  enableEditMode: () => void;
  closeModal: () => void;
}

function TicketDetailModalViewMode({ ticket, enableEditMode, closeModal }: TicketDetailModalEditViewInterface) {
  return (
    <>
      <ViewTicketCard ticket={ticket} />
      {createPortal(
        <>
          <ModalTitle className={titleStyles}>
            <TicketSlug className={slugStyles} ticket={ticket} />
            {ticket.name}
          </ModalTitle>
          <ViewTicketCardActions entity={ticket} onTicketEdit={enableEditMode} onDeleteSuccess={closeModal} />
        </>,
        document.getElementById("ticket-modal-header")!,
      )}
    </>
  );
}

export default observer(TicketDetailModalViewMode);
