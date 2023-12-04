import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldUser from "components/FormField/User";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface TicketResponsibleInterface {
  entity: TicketDetailEntity;
}

function TicketResponsible({ entity }: TicketResponsibleInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldUser
      title={t({ scope: "main_tab", place: "responsible_field", name: "title" })}
      value={entity.responsible}
    />
  );
}

export default observer(TicketResponsible);
