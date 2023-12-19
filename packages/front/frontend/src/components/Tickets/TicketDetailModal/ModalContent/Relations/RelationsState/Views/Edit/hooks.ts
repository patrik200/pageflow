import React from "react";
import { useViewContext } from "@app/front-kit";

import { LoadTicketsFilterEntity } from "core/storages/ticket/entities/LoadTicketsFilterEntity";

import { TicketRelationsStorage } from "core/storages/ticket/relations";

export function useLoadRelations() {
  const {
    ticketsStorageForList: { loadTicketsAsListPage },
  } = useViewContext().containerInstance.get(TicketRelationsStorage);

  const ticketFilterEntity = React.useMemo(() => LoadTicketsFilterEntity.buildEmpty(undefined), []);

  React.useEffect(() => {
    if (!ticketFilterEntity) return;
    void loadTicketsAsListPage(ticketFilterEntity, 1);
    return ticketFilterEntity.subscribeOnChange(() => void loadTicketsAsListPage(ticketFilterEntity, 1));
  }, [loadTicketsAsListPage, ticketFilterEntity]);

  return { ticketFilterEntity };
}
