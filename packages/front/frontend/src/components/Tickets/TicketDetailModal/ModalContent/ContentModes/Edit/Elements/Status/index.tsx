import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { SelectFieldOption } from "@app/ui-kit";

import FormFieldSelect from "components/FormField/Select";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

interface TicketStatusInterface {
  entity: EditTicketEntity;
}

function TicketStatus({ entity }: TicketStatusInterface) {
  const { t } = useTranslation("ticket-detail");
  const { ticketStatusDictionary } = useViewContext().containerInstance.get(DictionariesCommonStorage);

  const statusOptions = React.useMemo<SelectFieldOption<string | null>[]>(() => {
    if (!ticketStatusDictionary) return [];
    return ticketStatusDictionary.values.map(({ key, value }) => ({ value: key, label: value }));
  }, [ticketStatusDictionary]);

  React.useEffect(() => {
    if (entity.status) return;
    if (statusOptions.length === 0) return;
    entity.setStatus(statusOptions[0].value);
  }, [entity, statusOptions]);

  return (
    <FormFieldSelect
      edit
      required
      options={statusOptions}
      title={t({ scope: "main_tab", place: "status_field", name: "title" })}
      value={entity.status}
      errorMessage={entity.viewErrors.status}
      onChange={entity.setStatus}
    />
  );
}

export default observer(TicketStatus);
