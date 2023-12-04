import { useTranslation, useViewContext } from "@app/front-kit";
import { TableRow, TableCell, Icon, Badge, TableCellDefaultText, typographyOptionalStyleVariants } from "@app/ui-kit";
import { observer } from "mobx-react-lite";
import React from "react";

import Priority from "components/Priority";
import UserRow from "components/UserRow";

import { TicketEntity } from "core/entities/ticket/ticket";

import { DictionariesCommonStorage } from "core/storages/dictionary/common";

import { infoStyles } from "./style.css";

interface TicketsListRowProps {
  ticket: TicketEntity;
  onTicketClick: (ticket: TicketEntity) => void;
  getTicketHref: (ticket: TicketEntity) => string;
}

function TicketsListRow({ ticket, onTicketClick, getTicketHref }: TicketsListRowProps) {
  const { t } = useTranslation();
  const { ticketStatusDictionary } = useViewContext().containerInstance.get(DictionariesCommonStorage);

  const status = React.useMemo(
    () => ticketStatusDictionary.values.find((value) => value.key === ticket.status.key)?.value,
    [ticket.status.key, ticketStatusDictionary.values],
  );

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
    <TableRow href={ticketHref} onClick={handleTicketClick} hoverable>
      <TableCell>
        <TableCellDefaultText>{ticket.name}</TableCellDefaultText>
      </TableCell>
      <TableCell>
        <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>{status}</TableCellDefaultText>
      </TableCell>
      <TableCell>
        <Priority priority={ticket.priority} />
      </TableCell>
      <TableCell>{ticket.customer !== null && <UserRow user={ticket.customer} />}</TableCell>
      <TableCell>{ticket.responsible !== null && <UserRow user={ticket.responsible} />}</TableCell>
      <TableCell>
        {ticket.deadlineBadgeVariant && (
          <Badge
            icon="timeLine"
            variant={ticket.deadlineBadgeVariant}
            text={t({ scope: "kanban", place: "ticket_deadline", name: "date" }, { date: ticket.viewDeadline })}
          />
        )}
      </TableCell>
      <TableCell>
        {ticket.files.length !== 0 && (
          <div className={infoStyles}>
            <Icon icon="attachment2" />
            <TableCellDefaultText>{ticket.files.length}</TableCellDefaultText>
          </div>
        )}
      </TableCell>
      <TableCell>
        <TableCellDefaultText className={typographyOptionalStyleVariants.noWrap}>
          {ticket.viewCreatedAt}
        </TableCellDefaultText>
      </TableCell>
    </TableRow>
  );
}

export default observer(TicketsListRow);
