import React from "react";
import { DragDropContext, DraggableProvided, DraggableStateSnapshot, DropResult } from "react-beautiful-dnd";
import cn from "classnames";

import Spinner from "primitives/Spinner";

import {
  draggableListIsDraggingStyles,
  spinnerStyles,
  spinnerVisibleStyles,
  wrapperDisabledStyles,
  wrapperStyles,
} from "./style.css";

export interface DraggableListWrapperInterface {
  className?: string;
  loading?: boolean;
  fixHeightWhileDragging?: boolean;
  children: React.ReactNode;
  onChange: (
    sourceIndex: number,
    destinationIndex: number,
    sourceDroppableId: string,
    destinationDroppableId: string,
  ) => void;
}

function DraggableListWrapper({
  className,
  loading,
  fixHeightWhileDragging = true,
  children,
  onChange,
}: DraggableListWrapperInterface) {
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  const handleBeforeDragStart = React.useCallback(() => {
    if (!rootRef.current) return;
    if (!fixHeightWhileDragging) return;
    rootRef.current.style.height = rootRef.current.offsetHeight + "px";
    rootRef.current.classList.add(draggableListIsDraggingStyles);
  }, [fixHeightWhileDragging]);

  const handleDragEnd = React.useCallback(
    (result: DropResult) => {
      if (rootRef.current && fixHeightWhileDragging) {
        rootRef.current.style.removeProperty("height");
        rootRef.current.classList.remove(draggableListIsDraggingStyles);
      }
      if (!result.destination) return;
      if (
        result.destination.index === result.source.index &&
        result.destination.droppableId === result.source.droppableId
      )
        return;

      onChange(
        result.source.index,
        result.destination.index,
        result.source.droppableId,
        result.destination.droppableId,
      );
    },
    [fixHeightWhileDragging, onChange],
  );

  return (
    <div ref={rootRef} className={cn(className, wrapperStyles, loading && wrapperDisabledStyles)}>
      <DragDropContext onBeforeDragStart={handleBeforeDragStart} onDragEnd={handleDragEnd}>
        {children}
      </DragDropContext>
      <Spinner className={cn(spinnerStyles, loading && spinnerVisibleStyles)} />
    </div>
  );
}

export default React.memo(DraggableListWrapper);

export { draggableListIsDraggingStyles } from "./style.css";

export type DraggableListDragProvider = DraggableProvided;
export type DraggableListDragState = DraggableStateSnapshot;

export interface DraggableListDraggingProps {
  dragProvider: DraggableListDragProvider;
  dragState: DraggableListDragState;
}

export interface DraggableListComponentInterface<ITEM_VALUE> extends DraggableListDraggingProps {
  value: ITEM_VALUE;
  onClick?: () => void;
}
