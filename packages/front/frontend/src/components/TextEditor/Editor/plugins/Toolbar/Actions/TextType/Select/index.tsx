import React from "react";
import {
  Icon,
  PopupManagerModifierOffset,
  PopupSelectableList,
  SelectableListItem,
  SelectableListValue,
  SelectFieldOption,
  Typography,
  useSelectFieldValue,
} from "@app/ui-kit";

import { triggerIconStyles, triggerTextStyles, triggerWrapperStyles } from "./style.css";

interface ToolbarSelectInterface<VALUE extends SelectableListValue> {
  value: VALUE;
  options: SelectFieldOption<VALUE>[];
  onChange: (value: VALUE) => void;
}

function ToolbarSelect<VALUE extends SelectableListValue>({ value, options, onChange }: ToolbarSelectInterface<VALUE>) {
  const selectedValue = useSelectFieldValue(value, options);
  return (
    <PopupSelectableList
      primaryPlacement="bottom-start"
      offset={offset}
      popupWidth="auto"
      triggerElement={
        <div className={triggerWrapperStyles}>
          <Typography className={triggerTextStyles}>{selectedValue.value}</Typography>
          <Icon className={triggerIconStyles} icon="arrowDownSLine" />
        </div>
      }
      onSelect={onChange}
    >
      {options.map((option) => (
        <SelectableListItem
          key={option.value}
          selectable
          selected={value === option.value}
          value={option.value}
          mainLayout={option.label}
        />
      ))}
    </PopupSelectableList>
  );
}

export default React.memo(ToolbarSelect) as <VALUE extends SelectableListValue>(
  props: ToolbarSelectInterface<VALUE>,
) => React.JSX.Element;

const offset: PopupManagerModifierOffset = [-4, 4];
