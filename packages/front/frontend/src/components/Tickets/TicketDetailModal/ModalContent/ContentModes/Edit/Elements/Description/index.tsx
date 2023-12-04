import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldTextEditor from "components/FormField/TextEditor";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

interface TicketDescriptionInterface {
  entity: EditTicketEntity;
}

function TicketDescription({ entity }: TicketDescriptionInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldTextEditor
      edit
      title={t({ scope: "main_tab", place: "description_field", name: "title" })}
      value={entity.description}
      errorMessage={entity.viewErrors.description}
      onChange={entity.setDescription}
    />
  );
}

export default observer(TicketDescription);
