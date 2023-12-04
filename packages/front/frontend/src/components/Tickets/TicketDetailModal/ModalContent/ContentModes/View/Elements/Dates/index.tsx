import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { DateMode } from "@worksolutions/utils";

import FormFieldDate from "components/FormField/Date";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface TicketDatesInterface {
  entity: TicketDetailEntity;
}

function TicketDates({ entity }: TicketDatesInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <>
      <FormFieldDate
        view
        title={t({ scope: "main_tab", place: "create_date_field", name: "title" })}
        value={entity.createdAt}
        dateMode={DateMode.DATE_TIME_WITH_STRING_MONTH}
      />
      <FormFieldDate
        view
        title={t({ scope: "main_tab", place: "update_date_field", name: "title" })}
        value={entity.updatedAt}
        dateMode={DateMode.DATE_TIME_WITH_STRING_MONTH}
      />
    </>
  );
}

export default observer(TicketDates);
