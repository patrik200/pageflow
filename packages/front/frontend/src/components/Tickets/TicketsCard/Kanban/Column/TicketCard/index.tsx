import React from "react";
import { observer } from "mobx-react-lite";
import { Draggable } from "react-beautiful-dnd";

import { Link } from "components/Link";
import Divider from "components/Divider";
import Priority from "components/Priority";

import { TicketEntity } from "core/entities/ticket/ticket";

import Users from "./Users";
import Title from "./Title";
import Footer from "./Footer";

import { containerStyles } from "./style.css";

interface TicketCardInterface {
  index: number;
  ticket: TicketEntity;
  onTicketClick: (ticket: TicketEntity) => void;
  getTicketHref: (ticket: TicketEntity) => string;
}

function TicketCard({ ticket, index, getTicketHref, onTicketClick }: TicketCardInterface) {
  const handleTicketClick = React.useCallback(
    (event: React.MouseEvent) => {
      if (event.ctrlKey || event.metaKey) return;
      event.preventDefault();
      onTicketClick(ticket);
    },
    [onTicketClick, ticket],
  );

  const ticketHref = React.useMemo(() => getTicketHref(ticket), [getTicketHref, ticket]);

  return (
    <Link href={ticketHref} onClick={handleTicketClick}>
      <Draggable draggableId={ticket.id} index={index}>
        {(provided) => (
          <div
            className={containerStyles}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <Title ticket={ticket} />
            <Priority priority={ticket.priority} />
            <Users ticket={ticket} />
            <Divider />
            <Footer ticket={ticket} />
          </div>
        )}
      </Draggable>
    </Link>
  );
}

export default observer(TicketCard);
