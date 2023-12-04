import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldUser from "components/FormField/User";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

interface TicketCustomerInterface {
  entity: TicketDetailEntity;
}

function TicketCustomer({ entity }: TicketCustomerInterface) {
  const { t } = useTranslation("ticket-detail");

  return (
    <FormFieldUser title={t({ scope: "main_tab", place: "customer_field", name: "title" })} value={entity.customer} />
  );
}

export default observer(TicketCustomer);
