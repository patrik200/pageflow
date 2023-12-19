import React from "react";
import { observer } from "mobx-react-lite";

import Divider from "components/Divider";

import { TicketDetailEntity } from "core/entities/ticket/ticketDetail";

import Comments from "../../Comments";
import TicketAuthor from "./Elements/Author";
import TicketDescription from "./Elements/Description";
import TicketType from "./Elements/Type";
import TicketCustomer from "./Elements/Customer";
import TicketResponsible from "./Elements/Responsible";
import TicketDeadline from "./Elements/Deadline";
import TicketDates from "./Elements/Dates";
import TicketPriority from "./Elements/Priority";
import TicketStatus from "./Elements/Status";
import TicketAttachments from "./Elements/Attachments";
import ChangeFeedEvents from "./ChangeFeedEvents";

import { containerStyles } from "./style.css";

interface ViewTicketCardInterface {
  ticket: TicketDetailEntity;
}

function ViewTicketCard({ ticket }: ViewTicketCardInterface) {
  return (
    <div className={containerStyles}>
      <TicketAuthor entity={ticket} />
      <TicketDescription entity={ticket} />
      <TicketType entity={ticket} />
      <TicketCustomer entity={ticket} />
      <TicketResponsible entity={ticket} />
      <Divider />
      <TicketDeadline entity={ticket} />
      <TicketDates entity={ticket} />
      <TicketPriority entity={ticket} />
      <TicketStatus entity={ticket} />
      <Divider />
      <TicketAttachments entity={ticket} />
      {/*<Divider />*/}
      {/*<TicketRelations />*/}
      <Divider />
      <Comments />
      {ticket.changeFeedEvents.length !== 0 && (
        <>
          <Divider />
          <div>
            {ticket.changeFeedEvents.map((event, key) => (
              <ChangeFeedEvents key={key} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default observer(ViewTicketCard);

export { default as ViewTicketCardActions } from "./Actions";
