import React from "react";

import { Button, PopupSelectableList, SelectableListItem, SelectableListItemGroup } from "main";

import { buttonStyles } from "./style.css";

export function PopupSelectableListDemo() {
  return (
    <div>
      <PopupSelectableList
        strategy="fixed"
        triggerElement={<Button className={buttonStyles}>Open</Button>}
        maxHeight={200}
        popupWidth="auto"
        onSelect={console.log}
      >
        <SelectableListItem mainLayout="Hello" secondaryLayout="secondaryLayout" value="a" selected />
        <SelectableListItemGroup mainLayout="Hello" />
        <SelectableListItem mainLayout="Hello" value="b" />
        <SelectableListItem mainLayout="Hello" value="c" />
        <SelectableListItem mainLayout="Hello" value="d" />
        <SelectableListItem mainLayout="Hello" value="e" />
      </PopupSelectableList>
    </div>
  );
}
