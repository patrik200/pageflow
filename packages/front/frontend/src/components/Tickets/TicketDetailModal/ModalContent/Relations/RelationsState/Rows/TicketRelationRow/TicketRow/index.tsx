import React from "react";
import { observer } from "mobx-react-lite";
import cn from "classnames";
import { Typography } from "@app/ui-kit";

import Priority from "components/Priority";
import { Link } from "components/Link";

import { TicketEntity } from "core/entities/ticket/ticket";

import { nameStyles, slugStyles, wrapperStyles } from "./style.css";

interface TicketRelationTicketRowInterface {
  className?: string;
  ticket: TicketEntity;
}

function TicketRelationTicketRow({ className, ticket }: TicketRelationTicketRowInterface) {
  return (
    <Link className={cn(className, wrapperStyles)} href={`/tickets/${ticket.slug}`}>
      <Priority priority={ticket.priority} showText={false} />
      <Typography className={slugStyles}>{ticket.slug}</Typography>
      <Typography className={nameStyles}>{ticket.name}</Typography>
    </Link>
  );
}

export default observer(TicketRelationTicketRow);
