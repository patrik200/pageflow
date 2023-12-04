import React from "react";
import { Icon } from "@app/ui-kit";
import { observer } from "mobx-react-lite";

import NameAndImageRowAvatar from "components/NameAndImageRow/Avatar";

import { TicketEntity } from "core/entities/ticket/ticket";

import { usersDividerIconStyles, usersWrapperStyles } from "./style.css";

interface TicketUsersInterface {
  ticket: TicketEntity;
}

function TicketUsers({ ticket }: TicketUsersInterface) {
  if (ticket.customer === null && ticket.responsible === null) return null;
  return (
    <div className={usersWrapperStyles}>
      {ticket.customer && <NameAndImageRowAvatar image={ticket.customer.avatar} name={ticket.customer.name} />}
      {ticket.customer && ticket.responsible && <Icon className={usersDividerIconStyles} icon="arrowRightSLine" />}
      {ticket.responsible && <NameAndImageRowAvatar image={ticket.responsible.avatar} name={ticket.responsible.name} />}
    </div>
  );
}

export default observer(TicketUsers);
