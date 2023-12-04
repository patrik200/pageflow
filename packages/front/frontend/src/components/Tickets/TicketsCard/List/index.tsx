import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Table, TableBody, TableHead, TableHeadCell, TableHeadCellAvailableOrder, Spinner } from "@app/ui-kit";
import { identity } from "@worksolutions/utils";
import { useMemoizeCallback } from "@worksolutions/react-utils";
import { TicketSortingFields } from "@app/shared-enums";

import { TicketEntity } from "core/entities/ticket/ticket";

import { TicketsStorage } from "core/storages/ticket";

import TicketsListRow from "./Row";

import { spinnerStyles } from "./style.css";

interface TicketsListProps {
  loading: boolean;
  onTicketClick: (ticket: TicketEntity) => void;
  getTicketHref: (ticket: TicketEntity) => string;
}

function TicketsList({ loading, onTicketClick, getTicketHref }: TicketsListProps) {
  const { t } = useTranslation();
  const { ticketsList, filter } = useViewContext().containerInstance.get(TicketsStorage);

  const handleSortingFabric = useMemoizeCallback(
    (field: TicketSortingFields) => (value: TableHeadCellAvailableOrder) => {
      if (
        field === TicketSortingFields.CREATED_AT &&
        filter.getSortingForField(TicketSortingFields.CREATED_AT) === "DESC"
      ) {
        return filter.setSorting(TicketSortingFields.CREATED_AT, "ASC");
      }

      filter.setSorting(field, value);
      if (filter.sorting === undefined) filter.setSorting(TicketSortingFields.CREATED_AT, "DESC");
    },
    [filter],
    identity,
  );

  return (
    <>
      <Table>
        <TableHead>
          <TableHeadCell
            order={filter.getSortingForField(TicketSortingFields.NAME)}
            onChangeOrder={handleSortingFabric(TicketSortingFields.NAME)}
          >
            {t({ scope: "kanban", place: "ticket_list_column_headers", name: "name" })}
          </TableHeadCell>
          <TableHeadCell
            order={filter.getSortingForField(TicketSortingFields.STATUS)}
            onChangeOrder={handleSortingFabric(TicketSortingFields.STATUS)}
          >
            {t({ scope: "kanban", place: "ticket_list_column_headers", name: "status" })}
          </TableHeadCell>
          <TableHeadCell
            order={filter.getSortingForField(TicketSortingFields.PRIORITY)}
            onChangeOrder={handleSortingFabric(TicketSortingFields.PRIORITY)}
          >
            {t({ scope: "kanban", place: "ticket_list_column_headers", name: "priority" })}
          </TableHeadCell>
          <TableHeadCell>{t({ scope: "kanban", place: "ticket_list_column_headers", name: "customer" })}</TableHeadCell>
          <TableHeadCell>
            {t({ scope: "kanban", place: "ticket_list_column_headers", name: "responsible" })}
          </TableHeadCell>
          <TableHeadCell
            order={filter.getSortingForField(TicketSortingFields.DEADLINE_AT)}
            onChangeOrder={handleSortingFabric(TicketSortingFields.DEADLINE_AT)}
          >
            {t({ scope: "kanban", place: "ticket_list_column_headers", name: "deadline" })}
          </TableHeadCell>
          <TableHeadCell>
            {t({ scope: "kanban", place: "ticket_list_column_headers", name: "attachments" })}
          </TableHeadCell>
          <TableHeadCell
            order={filter.getSortingForField(TicketSortingFields.CREATED_AT)}
            onChangeOrder={handleSortingFabric(TicketSortingFields.CREATED_AT)}
          >
            {t({ scope: "kanban", place: "ticket_list_column_headers", name: "created" })}
          </TableHeadCell>
        </TableHead>
        <TableBody>
          {ticketsList.items.map((ticket) => (
            <TicketsListRow
              key={ticket.id}
              ticket={ticket}
              onTicketClick={onTicketClick}
              getTicketHref={getTicketHref}
            />
          ))}
        </TableBody>
      </Table>
      {loading && ticketsList.items.length !== 0 && <Spinner className={spinnerStyles} />}
    </>
  );
}

export default observer(TicketsList);
