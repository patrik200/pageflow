import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { DateMode } from "@worksolutions/utils";

import FormFieldDate from "components/FormField/Date";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface TicketDeadlineInterface {
  entity: TicketDetailEntity;
}

function TicketDeadline({ entity }: TicketDeadlineInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldDate
      view
      title={t({ scope: "main_tab", place: "deadline_field", name: "title" })}
      value={entity.deadlineAt}
      dateMode={DateMode.DATE_WITH_STRING_MONTH}
    />
  );
}

export default observer(TicketDeadline);
