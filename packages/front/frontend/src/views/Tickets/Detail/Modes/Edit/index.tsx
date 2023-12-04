import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import EditTicketCard, {
  EditTicketCardActions,
} from "components/Tickets/TicketDetailModal/ModalContent/ContentModes/Edit";
import Card from "components/Card";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";
import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface DetailTicketEditTabInterface {
  ticket: TicketDetailEntity;
  entity: EditTicketEntity;
  closeEditing: () => void;
}

function DetailTicketEditTab({ entity, ticket, closeEditing }: DetailTicketEditTabInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <>
      <CardTitlePreset
        title={t({ scope: "meta", name: "view" }, { name: ticket.name })}
        actions={<EditTicketCardActions entity={entity} onCancel={closeEditing} />}
      />
      <Card>
        <EditTicketCard entity={entity} />
      </Card>
    </>
  );
}

export default observer(DetailTicketEditTab);
