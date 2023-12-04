import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldPriority from "components/FormField/Priority";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface TicketPriorityInterface {
  entity: TicketDetailEntity;
}

function TicketPriority({ entity }: TicketPriorityInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldPriority
      title={t({ scope: "main_tab", place: "priority_field", name: "title" })}
      value={entity.priority}
    />
  );
}

export default observer(TicketPriority);
