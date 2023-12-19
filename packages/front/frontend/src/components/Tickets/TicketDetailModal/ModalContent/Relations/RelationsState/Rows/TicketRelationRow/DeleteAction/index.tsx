import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import { buttonStyles } from "./style.css";

interface DeleteTicketRelationActionInterface {
  index: number;
  ticketEntity: EditTicketEntity;
}

function DeleteTicketRelationAction({ index, ticketEntity }: DeleteTicketRelationActionInterface) {
  const handleDelete = React.useCallback(() => ticketEntity.deleteRelationByIndex(index), [ticketEntity, index]);
  return (
    <Button
      className={buttonStyles}
      type="WITHOUT_BORDER"
      size="SMALL"
      iconLeft="deleteBinLine"
      onClick={handleDelete}
    />
  );
}

export default observer(DeleteTicketRelationAction);
