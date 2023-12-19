import React from "react";
import { observer } from "mobx-react-lite";

import Divider from "components/Divider";

import { EditTicketEntity } from "core/storages/ticket/entities/EditTicket";

import TicketName from "./Elements/Name";
import TicketDescription from "./Elements/Description";
import TicketType from "./Elements/Type";
import TicketCustomer from "./Elements/Customer";
import TicketResponsible from "./Elements/Responsible";
import TicketDeadline from "./Elements/Deadline";
import TicketPriority from "./Elements/Priority";
import TicketStatus from "./Elements/Status";
import TicketAttachments from "./Elements/Attachments";

import { containerStyles } from "./style.css";

interface EditTicketCardInterface {
  entity: EditTicketEntity;
}

function EditTicketCard({ entity }: EditTicketCardInterface) {
  return (
    <div className={containerStyles}>
      <TicketName entity={entity} />
      <TicketDescription entity={entity} />
      <TicketType entity={entity} />
      <TicketCustomer entity={entity} />
      <TicketResponsible entity={entity} />
      <Divider />
      <TicketDeadline entity={entity} />
      <TicketPriority entity={entity} />
      <TicketStatus entity={entity} />
      <Divider />
      <TicketAttachments entity={entity} />
      {/*<Divider />*/}
      {/*<TicketRelations entity={entity} />*/}
    </div>
  );
}

export default observer(EditTicketCard);

export { default as EditTicketCardActions } from "./Actions";
