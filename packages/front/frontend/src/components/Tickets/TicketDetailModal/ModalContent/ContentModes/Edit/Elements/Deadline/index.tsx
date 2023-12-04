import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldDate from "components/FormField/Date";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

interface TicketDeadlineInterface {
  entity: EditTicketEntity;
}

function TicketDeadline({ entity }: TicketDeadlineInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldDate
      edit
      title={t({ scope: "main_tab", place: "deadline_field", name: "title" })}
      value={entity.deadlineAt}
      errorMessage={entity.viewErrors.deadlineAt}
      onChange={entity.setDeadlineAt}
    />
  );
}

export default observer(TicketDeadline);
