import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";

import DraggableListWrapper, { DraggableListComponentInterface } from "primitives/DraggableListWrapper";

interface SingleColumnDraggableListInterface<ITEM_VALUE extends Object, KEY extends keyof ITEM_VALUE> {
  className?: string;
  childrenWrapperClassName?: string;
  loading?: boolean;
  fixHeightWhileDragging?: boolean;
  droppableId?: string;
  Component: React.FC<DraggableListComponentInterface<ITEM_VALUE>>;
  list: ITEM_VALUE[];
  itemKey: KEY;
  onNewOrder: (items: ITEM_VALUE[KEY][]) => void;
  onItemClick?: (value: ITEM_VALUE, index: number) => void;
}

function SingleColumnDraggableList<ITEM_VALUE extends Object, KEY extends keyof ITEM_VALUE>({
  className,
  childrenWrapperClassName,
  list,
  itemKey,
  loading,
  droppableId = "droppable",
  fixHeightWhileDragging,
  Component,
  onNewOrder,
  onItemClick,
}: SingleColumnDraggableListInterface<ITEM_VALUE, KEY>) {
  const ids = React.useMemo(() => list.map((item) => item[itemKey]), [list, itemKey]);

  const handleChange = React.useCallback(
    (sourceIndex: number, destinationIndex: number) =>
      onNewOrder(updateSingleDragListOrder(ids, sourceIndex, destinationIndex)),
    [ids, onNewOrder],
  );

  const clickHandlers = React.useMemo(() => {
    if (!onItemClick) return [];
    return list.map((item, index) => () => onItemClick(item, index));
  }, [list, onItemClick]);

  return (
    <DraggableListWrapper
      className={className}
      loading={loading}
      fixHeightWhileDragging={fixHeightWhileDragging}
      onChange={handleChange}
    >
      <Droppable isDropDisabled={loading} droppableId={droppableId}>
        {(provided) => (
          <div {...provided.droppableProps} className={childrenWrapperClassName} ref={provided.innerRef}>
            {list.map((item, index) => {
              const id = item[itemKey] as any;
              return (
                <Draggable key={id} isDragDisabled={loading} draggableId={id} index={index}>
                  {(provided, snapshot) => (
                    <Component
                      value={item}
                      dragProvider={provided}
                      dragState={snapshot}
                      onClick={clickHandlers[index]}
                    />
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DraggableListWrapper>
  );
}

export default React.memo(SingleColumnDraggableList) as <ITEM_VALUE extends Object, KEY extends keyof ITEM_VALUE>(
  props: SingleColumnDraggableListInterface<ITEM_VALUE, KEY>,
) => React.JSX.Element;

export function updateSingleDragListOrder<T>(ids: T[], sourceIndex: number, destinationIndex: number) {
  const newIds = [...ids];
  const sourceElement = newIds[sourceIndex];

  if (destinationIndex > sourceIndex) {
    newIds.splice(destinationIndex + 1, 0, sourceElement);
    newIds.splice(sourceIndex, 1);
  } else {
    newIds.splice(sourceIndex, 1);
    newIds.splice(destinationIndex, 0, sourceElement);
  }

  return newIds;
}
