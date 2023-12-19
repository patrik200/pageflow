import { useViewContext } from "@app/front-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import { TicketRelationsStorage } from "core/storages/ticket/relations";

export function useTicket(ticketId: string) {
  const {
    ticketsStorageForList: { ticketsList },
  } = useViewContext().containerInstance.get(TicketRelationsStorage);

  return useObservableAsDeferredMemo(
    (ticketsList) => {
      return ticketsList.find((ticket) => ticket.id === ticketId);
    },
    [ticketId],
    ticketsList.items,
  );
}
