import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";

import FormFieldText from "components/FormField/Text";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

interface TicketTypeInterface {
  entity: TicketDetailEntity;
}

function TicketType({ entity }: TicketTypeInterface) {
  const { t } = useTranslation("ticket-detail");
  const { ticketTypeDictionary } = useViewContext().containerInstance.get(DictionariesCommonStorage);

  const typeValue = React.useMemo(() => {
    if (!ticketTypeDictionary || !entity.type) return "";
    const foundType = ticketTypeDictionary.values.find((dictionary) => dictionary.key === entity.type!.key);
    return foundType ? foundType.value : entity.status.key;
  }, [entity, ticketTypeDictionary]);

  return <FormFieldText view title={t({ scope: "main_tab", place: "type_field", name: "title" })} value={typeValue} />;
}

export default observer(TicketType);
