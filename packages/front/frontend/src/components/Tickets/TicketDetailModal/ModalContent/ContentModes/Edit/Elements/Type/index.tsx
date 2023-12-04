import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { SelectFieldOption } from "@app/ui-kit";

import FormFieldSelect from "components/FormField/Select";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

interface TicketTypeInterface {
  entity: EditTicketEntity;
}

function TicketType({ entity }: TicketTypeInterface) {
  const { t } = useTranslation("ticket-detail");
  const { ticketTypeDictionary } = useViewContext().containerInstance.get(DictionariesCommonStorage);

  const typeOptions = React.useMemo<SelectFieldOption<string | null>[]>(() => {
    const emptyValue: SelectFieldOption<null> = {
      label: t({ scope: "common:common_form_fields", place: "text", name: "empty_value" }),
      value: null,
    };

    if (!ticketTypeDictionary) return [emptyValue];
    return [emptyValue, ...ticketTypeDictionary.values.map(({ key, value }) => ({ value: key, label: value }))];
  }, [t, ticketTypeDictionary]);

  return (
    <FormFieldSelect
      edit
      options={typeOptions}
      title={t({ scope: "main_tab", place: "type_field", name: "title" })}
      value={entity.type}
      errorMessage={entity.viewErrors.type}
      onChange={entity.setType}
    />
  );
}

export default observer(TicketType);
