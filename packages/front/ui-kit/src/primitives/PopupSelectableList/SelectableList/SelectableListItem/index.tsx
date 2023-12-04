import React from "react";

import { SelectableListValue } from "../types";

import ListItem, { ListItemInterface } from "../List/Items/ListItem";
import { SelectableListContext } from "../index";

export type SelectableListItemInterface<VALUE extends SelectableListValue> = ListItemInterface & {
  value: VALUE;
};

function SelectableListItem({ value, selectable = true, onClick, ...props }: SelectableListItemInterface<any>) {
  const selectableListContext = React.useContext(SelectableListContext);
  const handleClick = React.useCallback(() => {
    selectableListContext.onSelect(value);
    if (onClick) onClick();
  }, [onClick, selectableListContext, value]);

  return <ListItem selectable={selectable} {...props} onClick={handleClick} />;
}

export default React.memo(SelectableListItem) as <VALUE extends SelectableListValue>(
  props: SelectableListItemInterface<VALUE>,
) => JSX.Element;
