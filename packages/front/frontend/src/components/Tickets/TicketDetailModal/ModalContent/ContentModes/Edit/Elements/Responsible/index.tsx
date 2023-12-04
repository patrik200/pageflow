import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldSelect from "components/FormField/Select";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import { useUserSelectOptions } from "../../commonHooks";

interface TicketResponsibleInterface {
  entity: EditTicketEntity;
}

function TicketResponsible({ entity }: TicketResponsibleInterface) {
  const { t } = useTranslation("ticket-detail");

  const responsibleOptions = useUserSelectOptions();

  return (
    <FormFieldSelect
      edit
      options={responsibleOptions}
      title={t({ scope: "main_tab", place: "responsible_field", name: "title" })}
      value={entity.responsible}
      errorMessage={entity.viewErrors.responsible}
      onChange={entity.setResponsible}
    />
  );
}

export default observer(TicketResponsible);
