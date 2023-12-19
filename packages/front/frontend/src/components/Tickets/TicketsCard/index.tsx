import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import CardTablePreset from "components/Card/pressets/CardTable";
import Card from "components/Card";

import { TicketEntity } from "core/entities/ticket/ticket";

import { TicketsStorage } from "core/storages/ticket";

import TicketsKanban from "./Kanban";
import TicketsList from "./List";
import CreateTicketAction from "./Actions/Create";
import TicketDetailModal from "../TicketDetailModal";
import PresentationSwitchAction from "./Actions/PresentationSwitch";
import TicketsFilters from "../Filters";
import { useTicketsLoading } from "./useTicketsLoading";

import { kanbanCardContentStyles, listCardContentStyles, cardStyles, kanbanStyles } from "./style.css";

interface TicketsCardInterface {
  projectId?: string;
  boardId: string;
}

function TicketsCard({ projectId, boardId }: TicketsCardInterface) {
  const ticketsStorage = useViewContext().containerInstance.get(TicketsStorage);
  React.useMemo(() => ticketsStorage.initEmptyFilter(boardId), [ticketsStorage, boardId]);
  const { presentationType } = ticketsStorage.filter;

  const { loading } = useTicketsLoading();

  const getTicketHref = React.useCallback((ticket: TicketEntity) => `/tickets/${ticket.slug}`, []);
  const [selectedTicketSlug, setSelectedTicketSlug] = React.useState<string | null>(null);
  const handleTicketClick = React.useCallback((ticket: TicketEntity) => setSelectedTicketSlug(ticket.slug), []);
  const handleCloseTicketModal = React.useCallback(() => setSelectedTicketSlug(null), []);

  return (
    <>
      <Card>
        <TicketsFilters loading={loading} />
      </Card>
      <CardTablePreset
        className={cardStyles}
        contentClassName={presentationType === "kanban" ? kanbanCardContentStyles : listCardContentStyles}
        secondaryActions={<PresentationSwitchAction />}
        actions={<CreateTicketAction projectId={projectId} boardId={boardId} />}
      >
        {presentationType === "kanban" ? (
          <TicketsKanban
            className={kanbanStyles}
            widthMeasureMode="outer"
            getTicketHref={getTicketHref}
            onTicketClick={handleTicketClick}
            updateTicketStatus={ticketsStorage.updateTicketStatus}
          />
        ) : (
          <TicketsList loading={loading} getTicketHref={getTicketHref} onTicketClick={handleTicketClick} />
        )}
      </CardTablePreset>
      <TicketDetailModal ticketSlug={selectedTicketSlug} onClose={handleCloseTicketModal} />
    </>
  );
}

export default observer(TicketsCard);
