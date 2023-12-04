import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";

import FormFieldText from "components/FormField/Text";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

interface TicketStatusInterface {
  entity: TicketDetailEntity;
}

function TicketStatus({ entity }: TicketStatusInterface) {
  const { t } = useTranslation("ticket-detail");
  const { ticketStatusDictionary } = useViewContext().containerInstance.get(DictionariesCommonStorage);

  const statusValue = React.useMemo(() => {
    if (!ticketStatusDictionary) return entity.status.key;
    const foundStatus = ticketStatusDictionary.values.find((dictionary) => dictionary.key === entity.status.key);
    return foundStatus ? foundStatus.value : entity.status.key;
  }, [entity, ticketStatusDictionary]);

  return (
    <FormFieldText view title={t({ scope: "main_tab", place: "status_field", name: "title" })} value={statusValue} />
  );
}

export default observer(TicketStatus);
