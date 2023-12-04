import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldTextEditor from "components/FormField/TextEditor";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface TicketDescriptionInterface {
  entity: TicketDetailEntity;
}

function TicketDescription({ entity }: TicketDescriptionInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldTextEditor
      view
      title={t({ scope: "main_tab", place: "description_field", name: "title" })}
      value={entity.description}
    />
  );
}

export default observer(TicketDescription);
