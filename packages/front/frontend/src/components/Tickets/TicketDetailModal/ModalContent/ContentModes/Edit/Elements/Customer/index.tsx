import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldSelect from "components/FormField/Select";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import { useUserSelectOptions } from "../../commonHooks";

interface TicketCustomerInterface {
  entity: EditTicketEntity;
}

function TicketCustomer({ entity }: TicketCustomerInterface) {
  const { t } = useTranslation("ticket-detail");

  const customerOptions = useUserSelectOptions();

  return (
    <FormFieldSelect
      edit
      options={customerOptions}
      title={t({ scope: "main_tab", place: "customer_field", name: "title" })}
      value={entity.customer}
      errorMessage={entity.viewErrors.customer}
      onChange={entity.setCustomer}
    />
  );
}

export default observer(TicketCustomer);
