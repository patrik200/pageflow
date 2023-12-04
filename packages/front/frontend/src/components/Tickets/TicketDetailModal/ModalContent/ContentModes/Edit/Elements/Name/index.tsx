import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldText from "components/FormField/Text";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

interface TicketNameInterface {
  entity: EditTicketEntity;
}

function TicketName({ entity }: TicketNameInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldText
      edit
      required
      title={t({ scope: "main_tab", place: "name_field", name: "title" })}
      value={entity.name}
      errorMessage={entity.viewErrors.name}
      onChange={entity.setName}
    />
  );
}

export default observer(TicketName);
