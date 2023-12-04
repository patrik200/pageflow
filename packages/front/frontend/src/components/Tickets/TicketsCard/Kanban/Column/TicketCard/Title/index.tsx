import React from "react";
import { Typography } from "@app/ui-kit";
import { observer } from "mobx-react-lite";

import { TicketEntity } from "core/entities/ticket/ticket";

import { titleStyles } from "./style.css";

interface TicketTitleInterface {
  ticket: TicketEntity;
}

function TicketTitle({ ticket }: TicketTitleInterface) {
  return <Typography className={titleStyles}>{ticket.name}</Typography>;
}

export default observer(TicketTitle);
