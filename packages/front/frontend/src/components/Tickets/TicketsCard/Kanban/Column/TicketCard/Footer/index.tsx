import React from "react";
import { observer } from "mobx-react-lite";
import { Badge, Icon, Typography } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { TicketEntity } from "core/entities/ticket/ticket";

import { attachmentsTextStyles, infoDeadlineWrapperStyles, infoStyles, wrapperStyles } from "./style.css";

interface TicketFooterInterface {
  ticket: TicketEntity;
}

function TicketFooter({ ticket }: TicketFooterInterface) {
  const { t } = useTranslation();

  return (
    <div className={wrapperStyles}>
      <div className={infoDeadlineWrapperStyles}>
        {ticket.deadlineBadgeVariant && (
          <Badge
            icon="timeLine"
            text={t({ scope: "kanban", place: "ticket_deadline", name: "date" }, { date: ticket.viewDeadline })}
            variant={ticket.deadlineBadgeVariant}
          />
        )}
      </div>
      <div className={infoStyles}>
        <Icon icon="attachment2" />
        <Typography className={attachmentsTextStyles}>{ticket.files.length}</Typography>
      </div>
    </div>
  );
}

export default observer(TicketFooter);
