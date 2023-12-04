import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { SelectFieldOption } from "@app/ui-kit";
import { TicketPriorities } from "@app/shared-enums";

import FormFieldSelect from "components/FormField/Select";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

interface TicketPriorityInterface {
  entity: EditTicketEntity;
}

function TicketPriority({ entity }: TicketPriorityInterface) {
  const { t } = useTranslation("ticket-detail");

  const priorityOptions = React.useMemo<SelectFieldOption<string | null>[]>(
    () =>
      Object.values(TicketPriorities).map((value) => ({
        value,
        label: t({ scope: "common:kanban", place: "ticket_priorities", name: value }),
      })),
    [t],
  );

  return (
    <FormFieldSelect
      edit
      options={priorityOptions}
      title={t({ scope: "main_tab", place: "priority_field", name: "title" })}
      value={entity.priority}
      errorMessage={entity.viewErrors.priority}
      onChange={entity.setPriority}
    />
  );
}

export default observer(TicketPriority);
