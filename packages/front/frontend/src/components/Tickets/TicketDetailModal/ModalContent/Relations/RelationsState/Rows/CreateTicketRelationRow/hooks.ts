import { useViewContext } from "@app/front-kit";
import { SelectFieldOption } from "@app/ui-kit";
import { useObservableAsDeferredMemo } from "@worksolutions/react-utils";

import { TicketEntity } from "core/entities/ticket/ticket";

import { TicketRelationsStorage } from "core/storages/ticket/relations";

export function useTicketSelectOptions(currentTicketId?: string) {
  const {
    ticketsStorageForList: { ticketsList },
  } = useViewContext().containerInstance.get(TicketRelationsStorage);

  return useObservableAsDeferredMemo(
    (ticketsList): SelectFieldOption<string>[] => {
      const tickets: TicketEntity[] = [...ticketsList];
      if (currentTicketId) {
        const index = tickets.findIndex((ticket) => ticket.id === currentTicketId);
        if (index !== -1) tickets.splice(index, 1);
      }
      return tickets.map((ticket) => ({ value: ticket.id, label: ticket.name, secondaryLabel: ticket.slug }));
    },
    [currentTicketId],
    ticketsList.items,
  );
}
