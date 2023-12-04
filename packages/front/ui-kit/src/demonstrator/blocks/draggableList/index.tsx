import React from "react";

import {
  body1regularStyles,
  DraggableListComponentInterface,
  Icon,
  SingleColumnDraggableList,
  Switch,
  Typography,
} from "main";

import { itemStyles, singleChildrenWrapperStyles, singleWrapperStyles, textStyles } from "./style.css";

export function DraggableListDemo() {
  const [singleOrder, setSingleOrder] = React.useState(["1", "2", "3"]);
  const singleList = React.useMemo<ListItem[]>(() => singleOrder.map((i) => ({ i })), [singleOrder]);

  const [loading, setLoading] = React.useState(false);
  const toggleLoading = React.useCallback(() => setLoading(!loading), [loading]);

  return (
    <>
      <Switch value={loading} onChange={toggleLoading}>
        <Typography className={body1regularStyles}>Loading</Typography>
      </Switch>
      <SingleColumnDraggableList
        className={singleWrapperStyles}
        childrenWrapperClassName={singleChildrenWrapperStyles}
        list={singleList}
        loading={loading}
        itemKey="i"
        Component={ListComponent}
        onNewOrder={setSingleOrder}
      />
    </>
  );
}

type ListItem = { i: string };

const ListComponent = React.memo(function ({ value: { i }, dragProvider }: DraggableListComponentInterface<ListItem>) {
  return (
    <div
      ref={dragProvider.innerRef}
      {...dragProvider.draggableProps}
      {...dragProvider.dragHandleProps}
      className={itemStyles}
    >
      <Icon icon="draggable" />
      <Typography className={textStyles}>{i}</Typography>
    </div>
  );
});
