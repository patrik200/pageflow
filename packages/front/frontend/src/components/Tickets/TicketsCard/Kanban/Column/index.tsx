import React from "react";
import { observer } from "mobx-react-lite";
import { Typography } from "@app/ui-kit";
import { DroppableProvided } from "react-beautiful-dnd";

import { TicketKanbanColumnEntity } from "core/entities/kanban/kanbanColumn";
import { TicketEntity } from "core/entities/ticket/ticket";

import TicketCard from "./TicketCard";

import { columnItemsStyles, columnStyles, columnTitleStyles } from "./style.css";

interface TicketsColumnInterface {
  column: TicketKanbanColumnEntity;
  provided: DroppableProvided;
  onTicketClick: (ticket: TicketEntity) => void;
  getTicketHref: (ticket: TicketEntity) => string;
}

function TicketsColumn({
  column: { dictionary, tickets },
  provided,
  onTicketClick,
  getTicketHref,
}: TicketsColumnInterface) {
  return (
    <div className={columnStyles}>
      <Typography className={columnTitleStyles}>
        {dictionary.value}: {tickets.length}
      </Typography>
      <div className={columnItemsStyles} {...provided.droppableProps} ref={provided.innerRef}>
        {tickets.map((ticket, index) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            index={index}
            getTicketHref={getTicketHref}
            onTicketClick={onTicketClick}
          />
        ))}
      </div>
    </div>
  );
}

export default observer(TicketsColumn);
