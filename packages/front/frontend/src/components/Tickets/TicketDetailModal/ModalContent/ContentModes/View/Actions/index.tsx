import React from "react";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

import DeleteTicketModal from "./Modals/DeleteTicket";

import { containerStyles, deleteButtonStyles } from "./style.css";

interface ViewActionsInterface {
  entity: TicketDetailEntity;
  onTicketEdit: () => void;
  onDeleteSuccess?: () => void;
}

function ViewActions({ entity, onTicketEdit, onDeleteSuccess }: ViewActionsInterface) {
  const { t } = useTranslation("ticket-detail");

  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);

  return (
    <div className={containerStyles}>
      <Button className={deleteButtonStyles} size="SMALL" iconLeft="deleteBinLine" onClick={openDelete}>
        {t({ scope: "ticket_modal", place: "actions", name: "delete" })}
      </Button>
      <DeleteTicketModal ticket={entity} opened={deleteOpened} onClose={closeDelete} onSuccess={onDeleteSuccess} />
      <Button size="SMALL" iconLeft="editLine" onClick={onTicketEdit}>
        {t({ scope: "ticket_modal", place: "actions", name: "edit" })}
      </Button>
    </div>
  );
}

export default React.memo(ViewActions);
