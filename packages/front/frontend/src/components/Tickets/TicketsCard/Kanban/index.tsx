import React from "react";
import { Scroll, ScrollProviderContextInterface } from "@app/ui-kit";
import { observer } from "mobx-react-lite";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import { useMeasure } from "@worksolutions/react-utils";
import cn from "classnames";
import { useViewContext } from "@app/front-kit";

import { TicketEntity } from "core/entities/ticket/ticket";
import { TicketKanbanColumnEntity } from "core/entities/kanban/kanbanColumn";

import { TicketsStorage } from "core/storages/ticket";

import TicketsColumn from "./Column";

import { scrollContentStyles, scrollStyles } from "./style.css";

export interface TicketsKanbanChangeInterface {
  ticket: TicketEntity;
  source: TicketKanbanColumnEntity;
  destination: TicketKanbanColumnEntity;
}

export interface TicketsKanbanInterface {
  className?: string;
  widthMeasureMode: "inner" | "outer";
  onTicketClick: (ticket: TicketEntity) => void;
  getTicketHref: (ticket: TicketEntity) => string;
  updateTicketStatus: (tickets: TicketEntity[], statusKey: string) => any;
}

function TicketsKanban({
  className,
  widthMeasureMode,
  onTicketClick,
  getTicketHref,
  updateTicketStatus,
}: TicketsKanbanInterface) {
  const { kanbanColumns } = useViewContext().containerInstance.get(TicketsStorage);

  const handleTicketDragEnd = React.useCallback(
    ({ source, destination }: DropResult) => {
      if (!destination || !source) return;
      const foundDestinationColumn = kanbanColumns.find(({ dictionary }) => dictionary.key === destination.droppableId);
      const foundSourceColumn = kanbanColumns.find(({ dictionary }) => dictionary.key === source.droppableId);
      if (!foundSourceColumn || !foundDestinationColumn) return;
      const foundTicket = foundSourceColumn.tickets[source.index];
      if (!foundTicket) return;
      foundSourceColumn.removeTicketByValue(foundTicket);
      foundDestinationColumn.addTicket(foundTicket, destination.index);
      updateTicketStatus(foundDestinationColumn.tickets, foundDestinationColumn.dictionary.key);
    },
    [kanbanColumns, updateTicketStatus],
  );

  const [scrollProvider, setScrollProvider] = React.useState<ScrollProviderContextInterface | null>(null);
  const [setMeasureElement, outerMeasure, innerMeasure] = useMeasure();

  React.useEffect(() => {
    if (!scrollProvider) return;
    setMeasureElement((scrollProvider.wrapperElement as HTMLElement).parentElement);
  }, [scrollProvider, setMeasureElement]);

  const scrollStyle = React.useMemo(
    () => ({ width: (widthMeasureMode === "inner" ? innerMeasure.width : outerMeasure.width) + "px" }),
    [innerMeasure.width, outerMeasure.width, widthMeasureMode],
  );

  const scrollContentStyle = React.useMemo(
    () => ({ gridTemplateColumns: `repeat(${kanbanColumns.length}, 1fr)` }),
    [kanbanColumns.length],
  );

  return (
    <Scroll style={scrollStyle} className={cn(className, scrollStyles)} scrollProviderRef={setScrollProvider}>
      <div style={scrollContentStyle} className={scrollContentStyles}>
        <DragDropContext onDragEnd={handleTicketDragEnd}>
          {kanbanColumns.map((column) => (
            <Droppable key={column.dictionary.key} droppableId={column.dictionary.key}>
              {(provided) => (
                <TicketsColumn
                  provided={provided}
                  column={column}
                  onTicketClick={onTicketClick}
                  getTicketHref={getTicketHref}
                />
              )}
            </Droppable>
          ))}
        </DragDropContext>
      </div>
    </Scroll>
  );
}

export default observer(TicketsKanban);
