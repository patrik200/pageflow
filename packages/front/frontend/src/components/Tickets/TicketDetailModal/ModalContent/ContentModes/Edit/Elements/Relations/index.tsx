import { observer } from "mobx-react-lite";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import Relations from "../../../../Relations";

interface TicketRelationsInterface {
  entity: EditTicketEntity;
}

function TicketRelations({ entity }: TicketRelationsInterface) {
  return <Relations edit ticketEntity={entity} />;
}

export default observer(TicketRelations);
